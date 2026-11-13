# Exercice 1 — Prise en main : chaque outil à sa place

 ## 2. Complétion d’une fonction
## Prompt

> pourquoi cette commande ne fonctionne pas dans le terminal : node --input-type=module -e "import {rotate} from './src/core/piece.js'; console.log(rotate([[1,2],[3,4]]))""

## Étapes réalisées

1. Vérifié le contenu de `src/core/piece.js` et reproduit l'erreur : le fichier exporte `rotate` avec la syntaxe ES modules, mais Node le traitait comme du CommonJS.
2. Ajouté `{"type":"module"}` dans le `package.json` à la racine du projet pour que Node interprète les fichiers `.js` comme des modules ES.
3. Relancé la commande pour vérifier : elle fonctionne et affiche `[[3,1],[4,2]]`.

## Chat en ligne 

>« lève une erreur si la matrice n’est pas carrée »

## Étapes réalisées

Coplilot à généré if (!Array.isArray(matrix)) {
        throw new Error("La matrice doit être carrée");
    } et     
    if (matrix.some((row) => !Array.isArray(row) || row.length !== n)) {
        throw new Error("La matrice doit être carrée");
    }

## Convention d’orientation et forme incorrecte

### Prompt

> « #file :src/core/piece.js quelle convention d’orientation utilisent ces matrices, et quelle forme est incorrecte ? »

### Étapes réalisées

1. Lu les matrices `PIECES` : elles sont représentées par lignes (de haut en bas) et colonnes (de gauche à droite), avec `1` pour une case occupée et `0` pour une case vide. Elles sont données dans l’orientation initiale (« orientation 0 »).
2. Vérifié `rotate` : la fonction effectue un quart de tour dans le sens horaire.
3. Identifié les formes refusées : la matrice doit être un tableau dont chaque ligne est un tableau de longueur égale au nombre de lignes. Par exemple, `[[1, 0], [1]]` n’est pas carrée. À noter : la validation actuelle accepte `[]` et ne vérifie pas que les cellules valent uniquement `0` ou `1`.
