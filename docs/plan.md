# Plan de réalisation du Tetris

## 1. Compléter le catalogue des pièces

Réutiliser `src/core/piece.js`, ses sept matrices `PIECES` et sa fonction `rotate`. Ajouter les couleurs standard sans dupliquer la logique de rotation.

**Tests de validation :** vérifier les sept pièces et leurs couleurs, les rotations horaires et les erreurs sur les matrices invalides.

## 2. Implémenter la grille et ses règles

Créer une grille 10 × 20 sans dépendance au DOM, avec détection des collisions, pose des pièces et suppression des lignes complètes.

**Tests de validation :** vérifier les dimensions, les limites et les collisions; confirmer qu’une ligne complète est supprimée et que les lignes supérieures descendent.

## 3. Créer le moteur de partie

Gérer l’état de la partie, la pièce active et la suivante, les déplacements, les rotations avec collision, le verrouillage des pièces et le game over. Injecter le générateur aléatoire pour rendre les parties reproductibles.

Mettre en place à cette étape un point d’entrée navigateur jouable (`index.html`) et le conserver pendant les étapes suivantes. Après chaque étape, ouvrir `index.html` avec l’extension Live Preview ou lancer `python3 -m http.server 8000` depuis la racine du projet, puis visiter `http://localhost:8000/` et vérifier manuellement que l’interface et les commandes disponibles fonctionnent.

**Tests de validation :** un générateur identique produit la même séquence; les déplacements, rotations, apparitions et conditions de game over produisent l’état attendu. Vérifier aussi le lancement navigateur après cette étape et après chacune des étapes suivantes.

## 4. Ajouter le score et la progression

Appliquer le barème de la spécification (100, 300, 500 ou 800 points selon le nombre de lignes), augmenter le niveau toutes les dix lignes et accélérer la chute avec le niveau. Règle de vitesse : 1 000 ms au niveau 1, réduction de 100 ms par niveau, avec un minimum de 100 ms.

**Tests de validation :** vérifier les scores pour une à quatre lignes, les seuils de niveau et les intervalles de chute; vérifier la mise à jour des compteurs dans l’interface et relancer le jeu dans le navigateur.

## 5. Relier l’interface et les commandes

Créer le rendu, la gestion des entrées et le point d’entrée. Ajouter les commandes clavier, les boutons Start/Pause/Restart, l’aperçu de la pièce suivante, l’animation de suppression de ligne, l’affichage du score final et la mise en page responsive.

**Tests de validation :** vérifier les actions clavier et boutons, la mise à jour des panneaux et l’écran de game over; tester l’animation et le rendu à plusieurs tailles d’écran. Lancer également le jeu dans le navigateur.

## Exécution des tests

Lancer les tests avec `npm test` sous Node.js 22.12 ou ultérieur, requis par la version actuelle de Vitest.
