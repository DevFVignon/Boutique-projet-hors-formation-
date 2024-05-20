import { isUserLoggedIn } from "./functions.js";

export async function updatePanier() {
    const panier = document.querySelector('.panier');
    const cartItems = panier.querySelector('.cart-items');
    cartItems.innerHTML = ''; // Vider le conteneur avant de le remplir

    let totalAmount = 0;

    const token = localStorage.getItem('token');

    async function fetchData(url, method = 'GET') {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur réseau : ${response.statusText}`);
        }

        return await response.json();
    }

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const quantity = parseInt(localStorage.getItem(key));

        if (key.startsWith('66') && quantity > 0) {
            try {
                const product = await fetchData(`http://localhost:3000/api/stuff/${key}`);
                if (product) {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    const name = document.createElement('span');
                    name.textContent = product.product.nom;
                    productDiv.appendChild(name);

                    const quantitySpan = document.createElement('span');
                    quantitySpan.textContent = ` x ${quantity} = `;
                    productDiv.appendChild(quantitySpan);

                    const price = document.createElement('span');
                    const totalPrice = product.product.prix * quantity;
                    price.textContent = `${totalPrice} €`;
                    productDiv.appendChild(price);

                    cartItems.appendChild(productDiv);

                    totalAmount += totalPrice;
                }
            } catch (e) {
                console.error(`Erreur lors de la récupération du produit avec l'ID "${key}":`, e);
            }
        }
    }

    const totalDiv = panier.querySelector('.total');
    if (!totalDiv) {
        const newTotalDiv = document.createElement('div');
        newTotalDiv.classList.add('total');
        newTotalDiv.textContent = `Total: ${totalAmount} €`;
        panier.appendChild(newTotalDiv);
        const btnValider = document.createElement('button');
        btnValider.innerText = 'Valider la commande';
        btnValider.classList.add('modal-trigger');
        panier.appendChild(btnValider);
    } else {
        totalDiv.textContent = `Total: ${totalAmount} €`;
    }



    // Assurez-vous de n'ajouter les éléments suivants qu'une seule fois
    const modal = document.querySelector(".modal");
    const modalContainer = document.querySelector(".modal-container");
    let messagePanier = modal.querySelector('.message-panier');
    if (!messagePanier) {
        messagePanier = document.createElement('div');
        messagePanier.classList.add('message-panier');
        modal.appendChild(messagePanier);
    }
    let buttonAcheter = modal.querySelector('.button-acheter');
    if (!buttonAcheter) {
        buttonAcheter = document.createElement("button");
        buttonAcheter.innerText = "Valider";
        buttonAcheter.classList.add('button-acheter');
        modal.appendChild(buttonAcheter);

        // Ajouter un gestionnaire d'événements au bouton "Valider" dans la modal
        buttonAcheter.addEventListener('click', viderPanier);
    }

    function toggleModal(price) {
        modalContainer.classList.toggle("active");
        messagePanier.innerText = `Votre panier s'élève à ${price} euros.`;
    }

    // Supprimer les anciens écouteurs d'événements avant d'en ajouter de nouveaux
    const oldTriggers = document.querySelectorAll('.modal-trigger');
    oldTriggers.forEach(trigger => trigger.removeEventListener("click", () => toggleModal(totalAmount)));
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    modalTriggers.forEach(trigger => trigger.addEventListener("click", () => toggleModal(totalAmount)));

    // Assurez-vous que le panier est visible si l'utilisateur est connecté
    if (isUserLoggedIn()) {
        panier.classList.add("active");
    }
}

// Fonction pour vider le panier et réinitialiser les quantités dans le localStorage
function viderPanier() {
    // Parcourir toutes les clés du localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('66')) {
            localStorage.setItem(key, '0');
        }
    }
    updatePanier();
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updatePanier();
});
