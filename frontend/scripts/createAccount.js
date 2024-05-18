let createAccountForm = document.querySelector(".createAccount");

createAccountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const createAccount = {
        email: event.target.querySelector("[name=user-email]").value,
        password: event.target.querySelector("[name=user-password]").value, // Ajout de la parenthèse fermante
    };
    const chargeUtile = JSON.stringify(createAccount);

    fetch('http://localhost:3000/api/auth/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('La création de votre compte a échoué, votre adresse email est peut-être déjà associée à un compte utilisateur.');
            }
        })
        .then(data => {
            // Gérer la réponse réussie ici
            console.log(data.message); // Afficher le message de succès
        })
        .catch(error => {
            // Gérer les erreurs ici
            console.error(error.message); // Afficher le message d'erreur
        });
});


//soit mettre un console log pour vérifier rapidement, soit créér des éléments à mettre dans le html pour que l'utilisateur ait un retour
//quand il appuie sur le bouton pour créér son cpte apres saisi email et mdp