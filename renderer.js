let intervalId; // Permet d'identifier le setInterval en cours et de l'annuler plus facilement

main();

async function main() {
    const form = document.getElementById("monFormulaire");
    // On ajoute un gestionnaire d'évènement 'submit'
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        afficherEpreuves(form.concours.value, form.epreuves.value.split(','));
        clearInterval(intervalId); // Stop un éventuel ancien setInterval
       
        intervalId = setInterval(afficherEpreuves, 600_000, form.concours.value, form.epreuves.value.split(','));
    });

}

async function afficherEpreuves(concours, epreuvesSouhaitees) {
    // on vide la div en cas d'une précédente recherche
    document.getElementById('infos-epreuves-concours').innerHTML = "";

    const reponse = await appelFFE(concours)

    const documentReponse = await miseEnFormeReponse(reponse);
   
    // Sélection de la NodeList lié aux épreuves
    const epreuvesConcours = documentReponse.body.querySelectorAll("tr[class=cv_liste_ligne_0]");

    // Affichage uniquement des épreuves renseignées dans le formulaire
    for (numeroEpreuveSouhaitee of epreuvesSouhaitees) {
        // L'information des places se trouve dans le children[4]
        const placesRestantes = epreuvesConcours[parseInt(numeroEpreuveSouhaitee, 10) - 1].children[4].innerHTML;
        
        afficherPlacesConcours(document, numeroEpreuveSouhaitee, placesRestantes);
        
        if(!isNaN(parseInt(placesRestantes)) && placesRestantes !== 0) {
            alert(`Place disponible pour l'épreuve ${numeroEpreuveSouhaitee}`);
            // shell.openExternal("http://www.google.com")
            clearInterval(intervalId);
        }
    }

}

async function appelFFE(concours) {
    const URL = `https://ffecompet.ffe.com/concours/${concours.trim()}/programme`
    return await fetch(URL);
}

async function miseEnFormeReponse(reponse) {
    const pageText = await reponse.text();
    const parser = new DOMParser();
    return parser.parseFromString(pageText, "text/html");
}

function afficherPlacesConcours(document, numeroEpreuveSouhaitee, placesRestantes) {
    let div = document.createElement("div");
    div.append(`Epreuve n° ${numeroEpreuveSouhaitee} - ${placesRestantes} place(s) restante(s).\n`);
    document.getElementById('infos-epreuves-concours').append(div);
}
