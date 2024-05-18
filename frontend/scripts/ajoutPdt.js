import { fetchData, getToken } from './functions.js';

async function init() {
    const token = await getToken();
    console.log(token);

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
            pdtNom: event.target.querySelector("[name=produit-nom]").value,
            pdtPrix: event.target.querySelector("[name=produit-prix]").value,
            pdtCategorie: event.target.querySelector("[name=produit-categorie]").value,
            pdtDescription: event.target.querySelector("[name=produit-description]").value,
        };
        console.log(product);

        const formData = new FormData();
        formData.append("image", product.image);
        formData.append("pdtNom", product.pdtNom);
        formData.append("pdtPrix", product.pdtPrix);
        formData.append("pdtCategorie", product.pdtCategorie);
        formData.append("pdtDescription", product.pdtDescription);

        fetch('http://localhost:3000/api/stuff/', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

init();
