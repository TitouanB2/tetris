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

**Outil utilisé :** Mode agent 

## Implémenter la grille de jeu

**Prompt (Copilot) :** « réalise l'étape 2 de #file :docs/PLAN.md »

**Correction liée :** créé `src/core/grid.js` pour créer la grille 10×20, détecter les collisions, poser les pièces sans muter la grille source et supprimer les lignes complètes; ajouté des tests unitaires associés.

**Outil utilisé :** Mode agent 

## Créer le moteur de partie

**Prompt (Copilot) :** « réalise l'étape 3 de #file :docs/PLAN.md »

**Correction liée :** créé `src/core/game.js` avec état de partie, RNG injectable ou initialisable par graine, déplacements, rotations avec collisions, verrouillage, apparition de la pièce suivante et game over; ajouté des tests unitaires. Ajout de l'interface utilisateur 

**Outil utilisé :** Mode agent 

## Ajouter le score et la progression

**Prompt (Copilot) :** « réalise l'étape 4 de #file :docs/PLAN.md »

**Correction liée :** ajouté le barème du score, le niveau toutes les dix lignes et l’accélération de la chute (1 000 ms au niveau 1, −100 ms par niveau, minimum 100 ms), avec affichage des statistiques et tests.

**Outil utilisé :** Mode agent .

## Relier l’interface et les commandes

**Prompt (Copilot) :** « réalise l'étape 5 de #file :docs/PLAN.md »

**Correction liée :** ajouté l’animation de suppression de lignes et l’affichage du score final; couvert le rendu, la réduction des animations et les commandes clavier par des tests.

**Outil utilisé :** Mode agent 


# A. Combien de requêtes agent et combien d’interventions manuelles a demandé le jeu complet ? Quelle étape a été reprise, et grâce à quelle information ?

J'ai eu besoins de 1 requête par étape, copilot à su faire les étape correctement, j'ai à partir de l'étape 3 si le jeux était jouable, tous fonctionne.

# B. Trouver une violation de copilot-instructions.md dans le code produit (langue, structure, fichier modifié hors tâche). Comment la faire corriger sans répéter la consigne ?

Violation repérée : la structure demandée par `.github/copilot-instruction.md` prévoit `styles.css` à la racine, mais la feuille de style créée se trouve dans `src/ui/style.css` et est référencée ainsi dans `index.html`.

Pour la faire corriger sans répéter toute la consigne, référencer le fichier d’instructions et demander uniquement la correction de cet écart : « En ce basant sur `.github/copilot-instruction.md`, corrige l’écart de structure de la feuille de style, mets à jour son lien dans `index.html` et ne modifie rien d’autre. »

# C. L’étape 2 aurait-elle été possible en un seul prompt comme au TP3 ? Qu’auriez-vous perdu ?

Oui, un prompt détaillé aurait pu demander toute l’étape 2 en une fois : création de la grille, détection des collisions, pose des pièces et suppression des lignes complètes. Mais on aurais perdu les validations intermédiaires de l'utilisateur et les potentiels retours : les tests séparés ont permis de vérifier chaque règle et de vériier et corriger plus facilement les erreurs. Le découpage rend aussi le code plus simple à comprendre et à faire évoluer. Car en une seule étape tous le code est générer en une seule étape donc la relecture est moins évidente.

# Exercice 3 Tests : fermer la boucle dans l’éditeur

## 1 
Pour la 1ere étape de cette éxecice copilot avait déjà généré les test lors des étapes donc je n'ai pas besoins de lui demandé.

## Mesurer la couverture du code

**Prompt (Copilot) :** « Pour cette étape permettant de tester l'ensemble du code installe @vitest/coverage-v8, ajoute un script "coverage": "vitest run –coverage" et vise 80 % de couverture sur src/core si le résultat est inférieur à 80% de coverage rajoite les test nécessaire »

**Correction liée :** installé `@vitest/coverage-v8`, ajouté le script `coverage` et un seuil minimal de 80 % pour `src/core`. La couverture mesurée  après l'installation est de 90.7% dpc aucun test supplémentaire n’a été nécessaire.

**Outil utilisé :** Copilot agent

## 4 Bug volontaire 

**Prompt (Copilot) :** « #terminalLastCommand fais passer les tests »

**Correction liée :** Copilot à vu que la couverture de code était différente de celle précédement réalisé il a donc chercher et corrigé la source du problème car ces agents n'avait pas changé le code


## Question A. Trouver un test généré qui passe mais ne vérifie rien d’utile (assertion tautologique, valeur recopiée du code). Le réécrire.

Tous les tests généré par copilot ont été utile 

## Question B. Au point 4, l’agent a-t-il corrigé le code ou aligné le test sur le bug ? Comment formuler la requête pour éviter le second cas ?
Il a relu les fichier et chercher la source du problème afin de corrigé le code et de respecter la règle formulé à la base.
S'il avait changé le test, le prompt aurait été : "Répare le test qui ne passe pas sans modifier sont comportement, corrige le code en respectant les règles énnoncé dans le fichier SPEC.md afin que le test passe."

## Question C. Qu’est-ce qui n’est pas couvert dans src/core, et pourquoi (code mort, chemin d’erreur, hasard non injecté) ?

Le dernier rapport `npm run coverage` mesure 93,7 % des lignes, 94,19 % des instructions, 90,74 % des branches et 100 % des fonctions de `src/core`. Les lignes non couvertes correspondent principalement à des chemins d’erreur qui valident des entrées invalides (grille, pièce, position, dimensions, valeur posée, générateur aléatoire et nombre de lignes) et au cas où une pièce est verrouillée au-dessus du plateau. Rien n’indique du code mort : il s’agit surtout de cas limites et de validations qui ne surviennent pas dans les scénarios courants.

# Exercice 4 Mode versus : plusieurs parties simultanées

## 1.

## Ajouter les modes Solo et multijoueur

**Prompt (Copilot) :** «  introduis une classe GameInstance (une partie : grille, pièce courante, score, état) et un GameManager (plusieurs instances, tour de jeu, fin de partie, gagnant = dernier en vie, podium). Écran de choix du mode : Solo, VS 1, 2 ou 3 adversaires. Grilles affichées côte à côte (2x2 au maximum) avec pseudo, score et niveau. Le mode solo doit rester identique. »

**Correction liée :** ajouté `GameInstance` et `GameManager`, le choix Solo/VS, les parties simultanées, des commandes distinctes pour quatre joueurs et le podium; mis à jour la spécification et ajouté des tests. Ajoute des fichier `game-instance.test.js` et `game-manager.test.js`

**Outil utilisé :** Copilot, mode plan.

## Questions


### A. Quelles fonctions le refactoring a-t-il déplacées ou renommées ? Un test a-t-il échoué pendant l’opération ? Lequel, et qu’a fait l’agent ?

**Réponse :** Aucune fonction du moteur n’a été déplacée ou renommée : `createGame`, `movePiece` et `rotateCurrentPiece` restent dans `src/core/game.js` et sont réutilisées par la nouvelle classe `GameInstance`. Dans `main.js`, les fonctions locales `move` et `rotate` ont été adaptées pour recevoir l’index du joueur et déléguer au `GameManager`; l’ancienne fonction `getMessage` a été remplacée par la construction des messages d’état dans `render`. Aucun échec des test déjà écrit intermédiaire n’est apparus pendant l'opération . Le résultat final vérifié est de 63 tests réussis.


### B. Comparer git diff ex3 ex4 –stat avec ce que vous auriez modifié à la main : l’agent a-t-il touché des fichiers inutiles ?

**Réponse :** Non (sauf si le css n'est pas nécessaire)

