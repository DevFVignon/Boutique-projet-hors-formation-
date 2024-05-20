// ----------------------Fonction pour récupérer le jeton d'authentification depuis le Local Storage----------------
function getToken() {
    return localStorage.getItem('token');
}
// function getEmail(){
//     return loccalStorage.getItem('email');
// }

// -------------------------Fonction à utiliser pour envoyer des requêtes avec le token ----------------------------
async function fetchData(url, method, product) {
    const token = await getToken(); // Récupère le jeton d'authentification depuis le stockage local
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Inclut le jeton dans l'en-tête Authorization
    };
    return fetch(url, {
        method: method,
        headers: headers,
        body: product ? JSON.stringify(product) : undefined // Corps de la requête (si des données sont fournies)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la requête.');
        }
        return response.json(); // Renvoie la réponse de la requête au format JSON
    })
    .catch(error => {
        console.error('Erreur de requête :', error.message);
    });
};

//---------f° pour savoir si l'utilisateur est connecté en vérifiant la présence du token JWT dans le localStorage------
function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function messageConnected(){
    if (isUserLoggedIn()){
        const divMessageConnected = document.querySelector(".divMessageConnected");
        const messageConnected = document.createElement('p');
        messageConnected.innerText=`Vous êtes connecté.`;
        divMessageConnected.appendChild(messageConnected);
    }else{const divMessageConnected = document.querySelector(".divMessageConnected");
    const messageConnected = document.createElement('p');
    messageConnected.innerText=`Bienvenue, si vous voulez faire des achats ou vendre des produits, il vous faut un compte.`;
    divMessageConnected.appendChild(messageConnected);}
};

// Export des fonctions
export {getToken};
export { fetchData };
export { isUserLoggedIn };
//export {getEmail};
export {messageConnected};

