import { fetchData, getToken} from './functions.js';//On récupère l'id du produit sur lequel l'utilisateur à cliqué 

const urlParams = new URLSearchParams(window.location.search);
const produitId = urlParams.get('id');
const token = getToken();
console.log(token);

//Afficher le nom du produit qui est modifié
async function afficherNomPdtModifié() {
    const response = await fetchData(`http://localhost:3000/api/stuff/${produitId}`, 'GET');
    const produit = response.product;
    const divNomPdt = document.querySelector(".divNomPdt");
    const nomPdt = document.createElement("h3");
    nomPdt.innerText= `Produit modifié : ${produit.nom}.`;
    const caracteristiquesPdt = document.createElement("p");
    caracteristiquesPdt.innerText = `Caractéristiques actuelles : ${produit.prix}€, ${produit.categorie}, ${produit.description}`
    divNomPdt.appendChild(nomPdt);
    divNomPdt.appendChild(caracteristiquesPdt);};

afficherNomPdtModifié().catch((erreur) =>{'Il y a eu une erreur de chargement au niveau du produit à modifier. '}
);

let ajoutPdtForm = document.querySelector(".ajoutPdt_form");

// Afficher la photo jointe par l'utilisateur 
document.getElementById('photo').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var imagePreview = document.getElementById('imagePreview');
        imagePreview.style.backgroundImage = 'url(' + e.target.result + ')';
    };

    reader.readAsDataURL(file);
});


ajoutPdtForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const product = {
        image: event.target.querySelector("[name=produit-photo]").files[0],
        nom: event.target.querySelector("[name=produit-nom]").value,
        prix: event.target.querySelector("[name=produit-prix]").value,
        categorie: event.target.querySelector("[name=produit-categorie]").value,
        description: event.target.querySelector("[name=produit-description]").value,
    };

    const formData = new FormData();
    if (product.image) {
        formData.append("image", product.image);
    }
    formData.append("thing", JSON.stringify({
        nom: product.nom,
        prix: product.prix,
        categorie: product.categorie,
        description: product.description,
    }));

    fetch(`http://localhost:3000/api/stuff/${produitId}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
