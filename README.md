# Poney
Cette application permet d'avoir une alerte quand une place pour un concours FFE se libère.
Il faut renseigner le numéro de concours et les épreuves qu'on veut suivre.
Plusieurs épreuves peuvent être suivies, pour cela il faut les séparer avec une virgule.

Une fois que des places se libèrent sur une épreuve, la recherche s'arrête. Il faut la relancer sur les épreuves restantes si on veut encore superviser les épreuves.

Cette application a été faite avec Electron afin d'obtenir un `.exe` facilement lançable sur un ordinateur.

## Développement
Pour lancer l'application en local il faut utiliser la commande `npm run start`.

## Build
La commande `npm run make` permet de builder l'application.
Cela va générer un dossier `out` avec l'exécutable de l'application.
