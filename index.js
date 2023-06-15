// const prompt = require('custom-electron-prompt')
// import { shell } from "electron";
let intervalId;

async function afficheEpreuves(concours, epreuvesSouhaitees) {
    // on vide la div en cas d'une précédente recherche
    document.getElementById('externalContent').innerHTML = "";
    // appel de la ressource
    const URL = `https://ffecompet.ffe.com/concours/${concours.trim()}/programme`
    const response = await fetch(URL);

    // Mise en forme de reponse
    const pageText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageText, "text/html");

    // Sélection de la NodeList lié aux épreuves
    const epreuvesConcours = doc.body.querySelectorAll("tr[class=cv_liste_ligne_0]");

    // Affichage uniquement des épreuves renseignées dans le formulaire
    for (numeroEpreuve of epreuvesSouhaitees) {
        let div = document.createElement("div");
        const placesRestantes = epreuvesConcours[parseInt(numeroEpreuve, 10) - 1].children[4].innerHTML;
        div.append(`Epreuve n° ${numeroEpreuve} - ${placesRestantes} place(s) restante(s).\n`)
        document.getElementById('externalContent').append(div);
        if(placesRestantes !=0) {
            alert(`Place disponible pour l'épreuve : ${numeroEpreuve}`);
            // shell.openExternal("http://www.google.com")
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