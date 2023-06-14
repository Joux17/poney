// const prompt = require('custom-electron-prompt')

async function afficheEpreuves(concours, epreuvesSouhaitees) {
    // appel de la ressource
    const URL = `https://ffecompet.ffe.com/concours/${concours}/programme`
    const response = await fetch(URL);

    // Mise en forme de reponse
    const pageText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageText, "text/html");

    // Sélection de la NodeList lié aux épreuves
    const epreuvesConcours = doc.body.querySelectorAll("tr[class=cv_liste_ligne_0]");

    // Affichage uniquement des épreuves renseignées dans le formulaire
    for (numeroEpreuve of epreuvesSouhaitees) {
        document.getElementById('externalContent').append(epreuvesConcours[parseInt(numeroEpreuve, 10) - 1]);
    }

}


async function main() {
    const form = document.getElementById("monFormulaire");

    // On ajoute un gestionnaire d'évènement 'submit'
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        document.getElementById('externalContent').innerHTML = ""; // on vide la div en cas d'une précédente recherche
        afficheEpreuves(form.concours.value, form.epreuves.value.split(',')); 
    });

}

main();