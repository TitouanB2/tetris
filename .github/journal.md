# Exercice 1 — Prise en main : chaque outil à sa place

 ## 2. Complétion d’une fonction
## Prompt

> pourquoi cette commande ne fonctionne pas dans le terminal : node --input-type=module -e "import {rotate} from './src/core/piece.js'; console.log(rotate([[1,2],[3,4]]))""

## Chat en ligne 

>« lève une erreur si la matrice n’est pas carrée »


### Ask avec contexte

> « #file :src/core/piece.js quelle convention d’orientation utilisent ces matrices, et quelle forme est incorrecte ? »

## Terminal 

> « Initialise npm et installe Vitest en dépendance de développement. »


## Agent


> « Crée `tests/piece.test.js` avec trois tests de `rotate` (matrice 2x2, matrice 3x3, matrice non carrée qui doit lever une erreur), puis lance les tests. »

## Checkpoint

> « Renomme rotate en tourner dans tout le projet  »
