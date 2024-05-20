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
    } else {
        totalDiv.textContent = `Total: ${totalAmount} €`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updatePanier();
});
