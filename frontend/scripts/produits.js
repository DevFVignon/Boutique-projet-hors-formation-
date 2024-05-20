import { fetchData, isUserLoggedIn, messageConnected, getToken } from './functions.js';
import { updatePanier } from './panier.js';

messageConnected();

const token = getToken();

const nav_account = document.querySelector('.nav_account');
const divProduit = document.querySelector('.divProduit');

// Fonction asynchrone pour récupérer tous les produits de la BdD
async function afficherProduits() {
    try {
        const response = await fetch('http://localhost:3000/api/stuff', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        if (!response.ok) {
            throw new Error('Erreur réseau : ' + response.statusText);
        }
        const data = await response.json();
        const produits = data.products;

        if (!Array.isArray(produits)) {
            throw new Error('Les données reçues ne sont pas un tableau de produits');
        }

        const produitsAffichés = document.querySelector(".produits__fiche");
        produitsAffichés.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouveaux produits

        produits.forEach(produit => {
            const produitContainer = document.createElement("div");
            produitContainer.classList.add("produits__fiche-container");

            const produitImage = document.createElement("img");
            produitImage.src = produit.imageUrl;
            produitContainer.appendChild(produitImage);

            const produitNom = document.createElement("h3");
            produitNom.innerText = produit.nom;
            produitContainer.appendChild(produitNom);

            const produitPrix = document.createElement("p");
            produitPrix.innerText = `Prix: ${produit.prix} €`;
            produitContainer.appendChild(produitPrix);

            const produitDescription = document.createElement("p");
            produitDescription.innerText = `A propos: ${produit.description}`;
            produitContainer.appendChild(produitDescription);

            produitsAffichés.appendChild(produitContainer);

            const produitId = produit._id;

            produitContainer.addEventListener('click', () => {
                window.open(`./fichePdt.html?id=${produitId}`, '_blank');
            });

            if (isUserLoggedIn()) {
                const addTotheCart = document.createElement('div');
                addTotheCart.classList.add("addToTheCard");

                const productId = produitId;

                const btnMinus = document.createElement("button");
                btnMinus.innerText = '-';
                addTotheCart.appendChild(btnMinus);

                const quantity = document.createElement("div");
                let quantityValue = localStorage.getItem(productId) ? parseInt(localStorage.getItem(productId)) : 0;
                quantity.innerText = quantityValue;
                addTotheCart.appendChild(quantity);

                const btnPlus = document.createElement("button");
                btnPlus.innerText = '+';
                addTotheCart.appendChild(btnPlus);

                produitContainer.appendChild(addTotheCart);

                function updateQuantity(value) {
                    quantityValue = value;
                    quantity.innerText = quantityValue;
                    localStorage.setItem(productId, quantityValue);
                    updatePanier(); // Mettre à jour le panier après la modification
                }

                btnMinus.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (quantityValue > 0) {
                        updateQuantity(quantityValue - 1);
                    }
                });

                btnPlus.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    updateQuantity(quantityValue + 1);
                });
            }
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors du chargement des données :", error);
    }
}

afficherProduits();

if (isUserLoggedIn()) {
    const btnAjoutPdt = document.createElement('button');
    btnAjoutPdt.innerText = 'Ajouter un produit';
    const lienAjout = document.createElement('a');
    lienAjout.href = './ficheAjoutPdt.html';
    lienAjout.appendChild(btnAjoutPdt);
    divProduit.appendChild(lienAjout);

    const btnDeconnexion = document.createElement('button');
    btnDeconnexion.classList.add("nav_account--btn");
    btnDeconnexion.innerText = 'Se déconnecter';
    nav_account.appendChild(btnDeconnexion);

    const btnCreateAccount = document.querySelector('.newAccount');
    nav_account.removeChild(btnCreateAccount);

    const btnLogin = document.querySelector('.login');
    nav_account.removeChild(btnLogin);

    btnDeconnexion.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = './index.html';
    });
} else {
    console.log('L\'utilisateur n\'est pas connecté.');
}
