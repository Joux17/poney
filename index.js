

function loadExternalSite() {
    const URL = "https://ffecompet.ffe.com/concours/202385029/programme#jour1"
    //const URL = 'https://h-23.net/api/tags/most-used?limit=5';
    return fetch(URL)
}

async function main() {
    console.log('Début main')

    const response = await loadExternalSite(); 
    const pageText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(pageText, "text/html");

    console.log(doc.body.getElementsByClassName("cv_liste_ligne_0"));
    
    document.getElementById('externalContent').append(doc.body);

    alert('toto');

    /*.then(siteDataAsString => {
        console.log('Chargement du site FFR réussi')
        document.getElementById('externalContent').innerHTML = siteDataAsString
        console.log('Les données ont été injectées dans le dom')
    })
    .catch(error => {
        console.error('Erreur lors du chargement du site de la FFE', error)
    })*/
}


main()