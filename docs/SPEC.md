# Tetris - spécification
Grille 10x20 ; les 7 pièces classiques avec leurs couleurs standard.
Commandes : gauche/droite, rotation (flèche haut), descente rapide (flèche bas),
pause (P). Détection de collision ; suppression des lignes complètes avec une
courte animation. Score : 1 ligne 100, 2 lignes 300, 3 lignes 500, 4 lignes 800 ;
niveau +1 toutes les 10 lignes, vitesse croissante. Affichage de la pièce
suivante. Boutons Start, Pause, Restart. Game over avec score final.
Panneau latéral : score, niveau, lignes, pièce suivante. Responsive.
Modes locaux : Solo, VS avec 1, 2 ou 3 adversaires. En VS, les parties avancent
simultanément, le dernier joueur encore en vie gagne, et les autres sont classés
par score décroissant. Pseudos par défaut : Joueur 1 à Joueur 4. Afficher les
grilles côte à côte (maximum 2x2) avec pseudo, score et niveau.
Architecture : src/core/{grid,piece,scoring,game}.js sans DOM, avec
GameInstance et GameManager pour les parties multiples ; src/ui/{renderer,
input}.js ; main.js relie les deux. Le générateur de pièces accepte une graine
(RNG injectable) pour des parties reproductibles.