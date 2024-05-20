export function updatePanier(){

document.addEventListener('DOMContentLoaded', async () => {
    const panier = document.querySelector('.panier');
    const cartItems = document.createElement('div');
    cartItems.classList.add('cart-items');
    panier.appendChild(cartItems);

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

        // Supposons que les clés des produits sont des IDs générés automatiquement qui commencent par "66"
        if (key.startsWith('66')) {
            if (quantity > 0) {
                try {
                    const product = await fetchData(`http://localhost:3000/api/stuff/${key}`);
                    
                    if (product) {
                        // Debugging output
                        console.log(typeof(product.product.prix));
                        console.log('Quantity:', quantity);

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
    }

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total');
    totalDiv.textContent = `Total: ${totalAmount} €`;
    panier.appendChild(totalDiv);
});

}

updatePanier();