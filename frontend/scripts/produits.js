import { fetchData, isUserLoggedIn, messageConnected, getToken } from './functions.js';

messageConnected();

const token = getToken();

const nav_account = document.querySelector('.nav_account');
const divProduit = document.querySelector('.divProduit');

// Fonction asynchrone pour récupérer tous les produits de la BdD
async function afficherProduits() {
    try {
        const response = await fetch('http://localhost:3000/api/stuff', {
            headers: {
                'Authorization': `Bearer ${token}` // Si votre API nécessite un token d'authentification
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

        // Création de .produits_fiche qui sera un conteneur pour chaque produit
        const produitsAffichés = document.querySelector(".produits__fiche");
        produitsAffichés.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouveaux produits

        produits.forEach(produit => {
            // Création d'un conteneur pour chaque produit
            const produitContainer = document.createElement("div");
            produitContainer.classList.add("produits__fiche-container");

            // Image du produit
            const produitImage = document.createElement("img");
            produitImage.src = produit.imageUrl;
            produitContainer.appendChild(produitImage);

            // Nom du produit
            const produitNom = document.createElement("h3");
            produitNom.innerText = produit.nom;
            produitContainer.appendChild(produitNom);

            // Prix du produit
            const produitPrix = document.createElement("p");
            produitPrix.innerText = `Prix: ${produit.prix} €`;
            produitContainer.appendChild(produitPrix);

            // Description du produit
            const produitDescription = document.createElement("p");
            produitDescription.innerText = `A propos: ${produit.description}`;
            produitContainer.appendChild(produitDescription);

            // Ajout du conteneur du produit à la liste des produits
            produitsAffichés.appendChild(produitContainer);

            const produitId = produit._id;

            produitContainer.addEventListener('click', () => {
                window.open(`./fichePdt.html?id=${produitId}`, '_blank');
            });
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors du chargement des données :", error);
    }
}

// Appel de la fonction afficherProduits
afficherProduits();

// Affichage des boutons pour ajouter un produit et se déconnecter si l'utilisateur est connecté
if (isUserLoggedIn()) {
    // Bouton pour ajouter un produit
    //const divBtnAjoutPdt = document.querySelector(".ajoutPdt_btn");
    //if (divBtnAjoutPdt) {
        const btnAjoutPdt = document.createElement('button');
        btnAjoutPdt.innerText = 'Ajouter un produit';
        const lienAjout = document.createElement('a');
        lienAjout.href = './ficheAjoutPdt.html';
        lienAjout.appendChild(btnAjoutPdt);
        divProduit.appendChild(lienAjout);
    //}

    // Bouton pour se déconnecter
    //const divDeconnexion = document.querySelector(".deconnexion");
    //if (divDeconnexion) {
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
    }
 else {
    console.log('L\'utilisateur n\'est pas connecté.');
}
