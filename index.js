// import { shell } from "electron";
const { ipcRenderer } = require("electron");

let intervalId; // Utiliser pour pouvoir stopper la fonction setInterval() une fois que des places se sont libérées dans une épreuve.

async function afficheEpreuves(concours, epreuvesSouhaitees) {
    // on vide la div contenant les infos des épreuves au cas où une précédente recherche a eu lieu.
    document.getElementById('infos-epreuves-concours').innerHTML = "";
    // appel de la ressource (lien du concours)
    const URL = `https://ffecompet.ffe.com/concours/${concours.trim()}/programme`
    const response = await fetch(URL); // L'appel nous ramène un document

    // Mise en forme de la reponse
    const pageText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageText, "text/html");

    // "tr[class=cv_liste_ligne_0]" est l'élément de la page HTML contenant les informations d'une épreuve.
    // La fonction permet de récupérer tous les éléments des épreuves sous la forme d'un tableau (de 'NodeList')
    const epreuvesConcours = doc.body.querySelectorAll("tr[class=cv_liste_ligne_0]");

    // Affichage uniquement des épreuves renseignées dans le formulaire
    for (numeroEpreuve of epreuvesSouhaitees) {
        // Le premier élément du tableau étant à 0, on doit décrément de 1 pour tomber sur l'épreuve désirée.
        // Ex. : l'épreuve souhaitée est la 6. On veut donc dans le tableau des épreuves globales l'élément qui est au 5ième rang.
        // L'information sur les places restantes à l'épreuve sont ensuite dans l'élément children à l'index 4.
        const placesRestantes = epreuvesConcours[parseInt(numeroEpreuve, 10) - 1].children[4].innerHTML;
        
        // Création d'une div contenant les informations de l'épreuve que l'on va ensuite ajouter à l'élément 'infos-epreuves-concours' afin de l'afficher à l'écran
        let div = document.createElement("div");
        div.append(`Epreuve n° ${numeroEpreuve} - ${placesRestantes} place(s) restante(s).\n`);
        document.getElementById('infos-epreuves-concours').append(div);
        
        if(placesRestantes !=0) {
            alert(`Place disponible pour l'épreuve ${numeroEpreuve}`);
            ipcRenderer.send("place-disponible", URL); // Permet d'envoyer un 'event' avec un contenu au `main.js` afin de déclencher une action
            clearInterval(intervalId);
        }
    }

}


async function main() {
    const form = document.getElementById("monFormulaire");
    // On ajoute un gestionnaire d'évènement 'submit'
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        afficheEpreuves(form.concours.value, form.epreuves.value.split(','));
        clearInterval(intervalId);
       
        intervalId = setInterval(afficheEpreuves, 600_000, form.concours.value, form.epreuves.value.split(','));
    });

}

main();