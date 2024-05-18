import { fetchData, getToken, messageConnected } from './functions.js';

let loginAccountForm = document.querySelector(".loginAccount");

loginAccountForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const loginAccount = {
        email: event.target.querySelector("[name=user-email]").value,
        password: event.target.querySelector("[name=user-password]").value,
    };

    const user = JSON.stringify(loginAccount);

    fetch('http://localhost:3000/api/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la connexion.');
        }
        return response.json(); // Retourner les données JSON de la réponse
    })
    .then(data => { // Modifier ici pour inclure le paramètre 'data'
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        getToken();
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Erreur de connexion :', error.message);
    });
});

