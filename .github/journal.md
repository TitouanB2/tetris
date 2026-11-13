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


# Exercice 2 Tetris solo, par étapes planifiées

## 2

## Proposer cinq étapes testables pour Tetris

**Prompt (Copilot) :** « #file :docs/SPEC.md #codebase propose un plan de réalisation en cinq étapes testables, en réutilisant src/core/piece.js »

**Correction liée :** aucune modification de code ; proposé un plan en cinq étapes testables aligné sur la spécification.

**Outil utilisé :** Copilot ask avec context.

## 3 Implémentation des étapes 
### Je ne peux pas compiler le jeux au départ donc je le compilerais à la fin des 5 étapes 

## Ajouter les couleurs standard des pièces

**Prompt (Copilot) :** « réalise l’étape 1 de #file :docs/PLAN.md »

**Correction liée :** ajouté `PIECE_COLORS` sans modifier les matrices ni `rotate`, et testé le catalogue des sept pièces, leurs couleurs et leur forme.

**Outil utilisé :** Copilot, éditeur de code et Vitest.

## Implémenter la grille de jeu

**Prompt (Copilot) :** « réalise l'étape 2 de #file :docs/PLAN.md »

**Correction liée :** créé `src/core/grid.js` pour créer la grille 10×20, détecter les collisions, poser les pièces sans muter la grille source et supprimer les lignes complètes; ajouté des tests unitaires associés.

**Outil utilisé :** Copilot, éditeur de code et Vitest.

## Créer le moteur de partie

**Prompt (Copilot) :** « réalise l'étape 3 de #file :docs/PLAN.md »

**Correction liée :** créé `src/core/game.js` avec état de partie, RNG injectable ou initialisable par graine, déplacements, rotations avec collisions, verrouillage, apparition de la pièce suivante et game over; ajouté des tests unitaires. Ajout de l'interface utilisateur 

**Outil utilisé :** Copilot, éditeur de code et Vitest.

## Ajouter le score et la progression

**Prompt (Copilot) :** « réalise l'étape 4 de #file :docs/PLAN.md »

**Correction liée :** ajouté le barème du score, le niveau toutes les dix lignes et l’accélération de la chute (1 000 ms au niveau 1, −100 ms par niveau, minimum 100 ms), avec affichage des statistiques et tests.

**Outil utilisé :** Copilot, éditeur de code et Vitest.

## Relier l’interface et les commandes

**Prompt (Copilot) :** « réalise l'étape 5 de #file :docs/PLAN.md »

**Correction liée :** ajouté l’animation de suppression de lignes et l’affichage du score final; couvert le rendu, la réduction des animations et les commandes clavier par des tests.

**Outil utilisé :** Copilot, éditeur de code, Vitest et navigateur.


# A. Combien de requêtes agent et combien d’interventions manuelles a demandé le jeu complet ? Quelle étape a été reprise, et grâce à quelle information ?

J'ai eu besoins de 1 requête par étape, copilot à su faire les étape correctement, j'ai à partir de l'étape 3 si le jeux était jouable, tous fonctionne.

# B. Trouver une violation de copilot-instructions.md dans le code produit (langue, structure, fichier modifié hors tâche). Comment la faire corriger sans répéter la consigne ?

Violation repérée : la structure demandée par `.github/copilot-instruction.md` prévoit `styles.css` à la racine, mais la feuille de style créée se trouve dans `src/ui/style.css` et est référencée ainsi dans `index.html`.

Pour la faire corriger sans répéter toute la consigne, référencer le fichier d’instructions et demander uniquement la correction de cet écart : « En ce basant sur `.github/copilot-instruction.md`, corrige l’écart de structure de la feuille de style, mets à jour son lien dans `index.html` et ne modifie rien d’autre. »

