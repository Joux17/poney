// const prompt = require('custom-electron-prompt')

async function chargeLaPageConcours(concours) {
    const URL = `https://ffecompet.ffe.com/concours/${concours}/programme`
    //const URL = 'https://h-23.net/api/tags/most-used?limit=5';
    const response = await fetch(URL);
    const pageText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(pageText, "text/html");

    const toto = doc.body.querySelectorAll("tr[class=cv_liste_ligne_0]");

    for (item of toto) {
        document.getElementById('externalContent').append(item);
    }

    console.log(doc);
}

async function main() {
    console.log('Début main')

    const form = document.getElementById("monFormulaire");

    // On ajoute un gestionnaire d'évènement 'submit'
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        document.getElementById('externalContent').innerHTML = ""; // on vide la div en cas d'une précédente recherche
        chargeLaPageConcours(form.concours.value);
    });


    //const epreuvesVoulues = prompt("Quelles épreuves tu veux ?").split(',');

    //console.log(epreuvesVoulues);

    // prompt({
    //     title: 'Prompt example',
    //     label: 'URL:',
    //     value: 'http://example.org',
    //     inputAttrs: {
    //         type: 'url'
    //     },
    //     type: 'input'
    // })
    // .then((r) => {
    //     if(r === null) {
    //         console.log('user cancelled');
    //     } else {
    //         console.log('result', r);
    //     }
    // })
    // .catch(console.error);

    // const response = await loadExternalSite();
    // const pageText = await response.text();

    // const parser = new DOMParser();
    // const doc = parser.parseFromString(pageText, "text/html");

    // const toto = doc.body.querySelectorAll("tr[class=cv_liste_ligne_0]");

    // for (numeroEpreuve of epreuvesVoulues) {
    //     document.getElementById('externalContent').append(toto[numeroEpreuve - 1])
    // }

    //for (item of toto) {
    //  document.getElementById('externalContent').append(item);
    //}

    // console.log(document);

    //document.getElementById('externalContent').append(doc.body.getElementsByClassName("cv_liste_ligne_0"));

    //    alert('toto');

    /*.then(siteDataAsString => {
        console.log('Chargement du site FFR réussi')
        document.getElementById('externalContent').innerHTML = siteDataAsString
        console.log('Les données ont été injectées dans le dom')
    })
    .catch(error => {
        console.error('Erreur lors du chargement du site de la FFE', error)
    })*/

}




main();