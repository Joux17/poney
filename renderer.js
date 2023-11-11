const { ipcRenderer } = require("electron");

let intervalId; // Utiliser pour pouvoir stopper la fonction setInterval() une fois que des places se sont libérées dans une épreuve.

async function afficheEpreuves(concours, epreuvesSouhaitees) {
    // on vide la div contenant les infos des épreuves au cas où une précédente recherche a eu lieu.
    document.getElementById('infos-epreuves-concours').innerHTML = "";

    const url = `https://ffecompet.ffe.com/concours/${concours.trim()}/programme`

	const documentConcours = await recuperationInformationsPageConcours(url);

    // "tr[class=cv_liste_ligne_0]" est l'élément de la page HTML contenant les informations d'une épreuve.
    // La fonction permet de récupérer tous les éléments des épreuves sous la forme d'un tableau (de 'NodeList')
    const epreuvesConcours = documentConcours.body.querySelectorAll("tr[class=cv_liste_ligne_0]");
    
    // Affichage uniquement des épreuves renseignées dans le formulaire
    for (numeroEpreuve of epreuvesSouhaitees) {
        // Le premier élément du tableau étant à 0, on doit décrément de 1 pour tomber sur l'épreuve désirée.
        // Ex. : l'épreuve souhaitée est la 6. On veut donc dans le tableau des épreuves globales l'élément qui est au 5ième rang.
        // L'information sur les places restantes à l'épreuve sont ensuite dans l'élément children à l'index 4.
        let epreuve = epreuvesConcours[parseInt(numeroEpreuve, 10) - 1];
        if(epreuve == null || epreuve == undefined) {
            arreterRequete();
            ouvrirFenetreAvertissement("Etes-vous sur de l'épreuve renseignée ?");
            return;
        }
        
        allumerLed();

        const placesRestantes = epreuve.children[4].innerHTML === '-' ? 0 : epreuve.children[4].innerHTML;

        // Création d'une div contenant les informations de l'épreuve que l'on va ensuite ajouter à l'élément 'infos-epreuves-concours' afin de l'afficher à l'écran
        let div = document.createElement("div");
        div.append(`Epreuve n° ${numeroEpreuve} - ${placesRestantes} place(s) restante(s).\n`);
        document.getElementById('infos-epreuves-concours').append(div);

        if (placesRestantes != 0) {
            const nomConcours = documentConcours.getElementsByClassName("boite TEnteteConcours")[0].getElementsByClassName("top")[0].getElementsByClassName("left")[0].innerText.split('- ').pop()

            const notificationActivee = document.querySelector('#notification').checked;

            const envoiMailActive = document.querySelector('#envoiMail').checked;

			ouvrirFenetreAvertissement(`Place disponible pour l'épreuve ${numeroEpreuve}`);

            if (envoiMailActive) {
                ipcRenderer.send("place-disponible", url, numeroEpreuve); // Permet d'envoyer un 'event' avec un contenu au `main.js` afin de déclencher l'action d'envoi de mail
            }

            if (notificationActivee) {
                afficherNotificationPlace(nomConcours, numeroEpreuve);
            }

            arreterRequete();
        }
    }

}

/**
 * Appel au site de la FFE pour récupérer le document fourni par la ressource et le met en forme
 * @param {*} concours 
 * @returns 
 */
async function recuperationInformationsPageConcours(url) {
	// appel de la ressource (lien du concours)
    const response = await fetch(url); // L'appel nous ramène un document

    if (response.url !== url) {
        ouvrirFenetreAvertissement("Avez-vous renseigné le bon numéro de concours ?");
        arreterRequete();
        return;
    }

    // Mise en forme de la reponse
    const pageText = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(pageText, "text/html");
}

function ouvrirFenetreAvertissement(message) {
	ipcRenderer.send("ouvrir-avertissement", message);
}

// Permet l'affichage d'une notification OS
function afficherNotificationPlace(concours, numeroEpreuve) {
    const NOTIFICATION_TITLE = `Concours Poney ${concours}`;
    const NOTIFICATION_BODY = `Place disponible pour l'épreuve ${numeroEpreuve}`;
    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY });
}

async function main() {
    const form = document.getElementById("formulairePoney");
    // On ajoute un gestionnaire d'évènement 'submit'
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        afficheEpreuves(form.concours.value, form.epreuves.value.split(','));
        arreterRequete();

        intervalId = setInterval(afficheEpreuves, 600_000, form.concours.value, form.epreuves.value.split(','));

    });
}

function allumerLed() {
    document.getElementById('led-red').style.display = 'none';
    document.getElementById('led-green').style.display = 'block';
}

function eteindreLed() {
    document.getElementById('led-green').style.display = 'none';
    document.getElementById('led-red').style.display = 'block';
}

function arreterRequete() {
    clearInterval(intervalId);
    eteindreLed();
}

main();