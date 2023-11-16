# Poney
Cette application permet d'avoir une alerte quand une place pour un concours FFE se libère.
Il faut renseigner le numéro de concours et les épreuves qu'on veut suivre.
Plusieurs épreuves peuvent être suivies, pour cela il faut les séparer avec une virgule.

Cette application a été faite avec Electron afin d'obtenir un `.exe` facilement lançable sur un ordinateur.

## Développement

Le point d'entrée pour le code est le fichier `main.js`. C'est lui qui va démarrer l'application.
On lui passe le nom du fichier html que l'on veut charger.
Le HTML fait le lien avec le fichier javascript en charge du traitement logique.

## Build
La commande `npm run make` permet de builder l'application.
Cela va générer un dossier `out` avec l'exécutable de l'application.
