Classe AIPlayer dans src/core/ai.js, trois niveaux :
- débutant : rotation et colonne aléatoires ;
- intermédiaire : évalue chaque placement possible (hauteur moyenne, trous,
lignes complétées) et choisit le meilleur ;
- expert : score = -0.51 * hauteur agrégée + 0.76 * lignes - 0.36 * trous
- 0.18 * irrégularité, avec anticipation de la pièce suivante.
decide(grid, piece, next) renvoie {rotation, colonne} ; l’évaluation travaille sur
une copie de la grille. Les coups sont ensuite joués par le GameManager avec les
mêmes fonctions que le joueur humain, un mouvement à la fois, avec un délai de 100
à 300 ms selon le niveau. Le niveau est affiché sous le pseudo.