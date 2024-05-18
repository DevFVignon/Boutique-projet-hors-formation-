//On récupère l'id du produit sur lequel l'utilisateur à cliqué 
const urlParams = new URLSearchParams(window.location.search);
const produitId = urlParams.get('id');
const token = getToken();
console.log(token);

import { fetchData, isUserLoggedIn, getToken } from "./functions.js";

//Fonction asynchrone qui envoie une requete avec l'id personnalisé pour récupérer les données du produit visé
async function afficherLeProduit() {
    const response = await fetchData(`http://localhost:3000/api/stuff/${produitId}`, 'GET'); //récup d° du pdt
    const produit = response.product; //stockage de la réponse dans constante produit

    //Création de .produits_fiche qui sera le conteneur du produit visé
    const produitsAffichés = document.querySelector(".produits__fiche");

        // Ajout d'un attribut de données pour l'ID du produit
        //produitContainer.dataset.productId = produit._id; 


        // Création d'un conteneur pour chaque produit
        const produitContainer = document.createElement("div");
        produitContainer.classList.add("produits__ficheDetaillee");

        // Image du produit
        const produitImage = document.createElement("img");
        produitImage.src = produit.imageUrl;
        produitContainer.appendChild(produitImage);

        const infoProduit = document.createElement("div");
        produitContainer.appendChild(infoProduit);

        // Nom du produit
        const produitNom = document.createElement("h3");
        produitNom.innerText = produit.nom;
        infoProduit.appendChild(produitNom);

        // Prix du produit
        const produitPrix = document.createElement("p");
        produitPrix.innerText = `Prix: ${produit.prix} €`;
        infoProduit.appendChild(produitPrix);

        // Description du produit
        const produitDescription = document.createElement("p");
        produitDescription.innerText = `A propos. ${produit.description}`;
        infoProduit.appendChild(produitDescription);



        // Ajout du conteneur du produit à la liste des produits
        produitsAffichés.appendChild(produitContainer);

        if (isUserLoggedIn()) {
            const btnModifPdt = document.createElement("button");
            btnModifPdt.innerText = 'Modifier le produit';
            const lien = document.createElement('a');
            lien.href = './ficheModifPdt.html';
            lien.appendChild(btnModifPdt);  // Ajout du bouton au lien
            infoProduit.appendChild(lien);  // Ajout du lien (contenant le bouton) au conteneur du produit
            
            btnModifPdt.addEventListener('click', (event) => {
                window.open(`./ficheModifPdt.html?id=${produitId}`, '_blank');});
                }else{console.log('Il faut être connecté pour faire apparaître le bouton Modifier le produit.')};
            
            
            //Ajout bouton supprimer le produit si l'utilisateur est connecté
            if (isUserLoggedIn()) {
                const btnSupprimerPdt = document.createElement("button");
                btnSupprimerPdt.innerText = 'Supprimer le produit';
                infoProduit.appendChild(btnSupprimerPdt);
                
                btnSupprimerPdt.addEventListener('click', (event)=>{
                    event.preventDefault();
                    console.log(produitId);

                    fetch(`http://localhost:3000/api/stuff/${produitId}`, {method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }})
                    .then(response=>{const mssgPdtSupprime = document.createElement("p");
                    mssgPdtSupprime.innerText = 'Le produit a bien été supprimé, vous allez être redirigé vers l\'accueil.';
                    produitContainer.appendChild(mssgPdtSupprime);
                    window.location.href = 'index.html';
                    })
                    .catch(erreur=>{const mssgErreur = document.createElement("p");
                    mssgErreur.innerText = 'La suppression du produit a échoué, retentez en repassant par l\'accueil';
                    produitContainer.appendChild(mssgErreur) 
                        });
                })}else{console.log('Il faut être connecté pour faire apparaître le bouton Déconnexion.')};
     
                
    };

// Appel de la fonction afficherLeProduit
afficherLeProduit().catch((erreur) => {
    console.error("Une erreur s'est produite lors du chargement des données :", erreur);
});

