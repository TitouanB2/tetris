# Journal des prompts

## Corriger l’import ES module

**Prompt (Copilot) :** « pourquoi cette commande ne fonctionne pas dans le terminal : `node --input-type=module -e "import {rotate} from './src/core/piece.js'; console.log(rotate([[1,2],[3,4]]))"` »

**Correction liée :** ajouté `"type": "module"` dans `package.json`.

**Outil utilisé :** Copilot terminal.

## Vérifier que la matrice est carrée

**Prompt (Copilot) :** « lève une erreur si la matrice n’est pas carrée »

**Correction liée :** ajouté la vérification que l’argument est un tableau carré.

**Outil utilisé :** Copilot et éditeur de code.
## Expliquer l’orientation des matrices

**Prompt (Copilot) :** « #file :src/core/piece.js quelle convention d’orientation utilisent ces matrices, et quelle forme est incorrecte ? »

**Correction liée :** aucune correction de code ; expliqué la représentation par lignes et colonnes, la rotation horaire et l’exemple de matrice non carrée.

**Outil utilisé :** Copilot Ask.

## Initialiser npm et installer Vitest

**Prompt (Copilot) :** « Initialise npm et installe Vitest en dépendance de développement. »

**Correction liée :** initialisé `package.json`, ajouté Vitest en dépendance de développement, généré `package-lock.json` et ignoré `node_modules/`.

**Outil utilisé :** Copilot terminal .

## Configurer le script de test

**Prompt (Copilot) :** « ajouter dans package.json le champ `"type": "module"` et le script `"test": "vitest run"`. »

**Correction liée :** conservé `"type": "module"` et défini le script `test` sur `vitest run`.

**Outil utilisé :** Copilot complétion.

## Tester `rotate`

**Prompt (Copilot) :** « Crée `tests/piece.test.js` avec trois tests de `rotate` (matrice 2x2, matrice 3x3, matrice non carrée qui doit lever une erreur), puis lance les tests. »

**Correction liée :** créé trois tests dans `tests/piece.test.js` ; les trois passent avec Node 22.

**Outil utilisé :** Copilot, éditeur de code et terminal Vitest.

## Renommer `rotate`

**Prompt (Copilot) :** « Renomme rotate en tourner dans tout le projet »

**Correction liée :** aucune correction documentée pour ce prompt.

**Outil utilisé :** Copilot agent.


# Question A : Les sept matrices de l’étape 1 étaient-elles toutes justes ? Laquelle ne l’était pas ? Qu’est-ce que cela dit de la complétion sur un sujet « connu » ?

    Toute les matrices était correcte au départ, celà veut dire que la complétion sur un sujet connu est plus performante.

# Question B : B. Consulter la consommation de crédits sur la page Copilot de vos paramètres GitHub : combien ont coûté les étapes 6 et 7 ? Et les étapes 1 à 3 ?

J'ai utilisé 15% des crédit permit par Copilot Free

# Question C : C. Pour chacun des besoins suivants, quel outil choisir : compléter une ligne, modifier une fonction, comprendre un fichier, ajouter une fonctionnalité sur trois fichiers, faire passer un test qui échoue ?

Compléter une ligne : copilot complétion
Modifier une fonction : copilot complétion d'une fonction
comprendre un fichier : Ask avec context
ajouter une fonctionnalité : Agent
faire passer un test qui échoue : Ask avec context