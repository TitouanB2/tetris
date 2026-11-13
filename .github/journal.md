# Journal des prompts

## Corriger l’import ES module

**Prompt (Copilot) :** « pourquoi cette commande ne fonctionne pas dans le terminal : `node --input-type=module -e "import {rotate} from './src/core/piece.js'; console.log(rotate([[1,2],[3,4]]))"` »

**Correction liée :** ajouté `"type": "module"` dans `package.json`.

**Outil utilisé :** Copilot et terminal Node.js.

## Vérifier que la matrice est carrée

**Prompt (Copilot) :** « lève une erreur si la matrice n’est pas carrée »

**Correction liée :** ajouté la vérification que l’argument est un tableau carré.

**Outil utilisé :** Copilot et éditeur de code.

## Expliquer l’orientation des matrices

**Prompt (Copilot) :** « #file :src/core/piece.js quelle convention d’orientation utilisent ces matrices, et quelle forme est incorrecte ? »

**Correction liée :** aucune correction de code ; expliqué la représentation par lignes et colonnes, la rotation horaire et l’exemple de matrice non carrée.

**Outil utilisé :** Copilot et lecture de `src/core/piece.js`.

## Initialiser npm et installer Vitest

**Prompt (Copilot) :** « Initialise npm et installe Vitest en dépendance de développement. »

**Correction liée :** initialisé `package.json`, ajouté Vitest en dépendance de développement, généré `package-lock.json` et ignoré `node_modules/`.

**Outil utilisé :** Copilot et terminal npm.

## Configurer le script de test

**Prompt (Copilot) :** « ajouter dans package.json le champ `"type": "module"` et le script `"test": "vitest run"`. »

**Correction liée :** conservé `"type": "module"` et défini le script `test` sur `vitest run`.

**Outil utilisé :** Copilot et éditeur de code.

## Tester `rotate`

**Prompt (Copilot) :** « Crée `tests/piece.test.js` avec trois tests de `rotate` (matrice 2x2, matrice 3x3, matrice non carrée qui doit lever une erreur), puis lance les tests. »

**Correction liée :** créé trois tests dans `tests/piece.test.js` ; les trois passent avec Node 22.

**Outil utilisé :** Copilot, éditeur de code et terminal Vitest.

## Renommer `rotate`

**Prompt (Copilot) :** « Renomme rotate en tourner dans tout le projet »

**Correction liée :** aucune correction documentée pour ce prompt.

**Outil utilisé :** Copilot.




