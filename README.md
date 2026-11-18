# Tetris

Tetris jouable dans le navigateur, écrit en JavaScript avec des modules ES. Le jeu propose un mode solo et des matchs contre une à trois IA, des niveaux de difficulté réglables, un score, des niveaux de vitesse et un podium.

## Prérequis

- Un navigateur moderne prenant en charge les modules ES et Canvas.
- Python 3 pour lancer le serveur HTTP local.
- Node.js 22.12 ou ultérieur et npm pour les tests et les scripts de développement.

## Installation

À la racine du dépôt, installez les dépendances de développement :

```bash
npm install
```

## Lancement du jeu

Depuis la racine du dépôt, lancez le serveur statique :

```bash
python3 -m http.server 8000
```

Ouvrez ensuite <http://localhost:8000/>. Arrêtez le serveur avec `Ctrl+C`.

Ne lancez pas `index.html` directement avec une URL `file://` : les modules ES sont servis par HTTP.

## Modes et commandes

- **Solo** : contrôlez votre pièce avec les flèches gauche/droite, faites-la tourner avec `↑`, descendez plus vite avec `↓` et mettez le jeu en pause avec `P`.
- **VS 1, 2 ou 3 adversaires** : choisissez le niveau des adversaires IA avant de démarrer. Les flèches contrôlent le joueur humain; les IA jouent simultanément. `P` met le match en pause.
- **Contrôles communs** : les boutons Démarrer/Reprendre, Pause, Recommencer et Changer de mode sont disponibles dans l’interface.

Complétez des lignes pour gagner des points : 100 points pour une ligne, 300 pour deux, 500 pour trois et 800 pour quatre. Le niveau augmente toutes les dix lignes; la chute accélère jusqu’à un intervalle minimum de 100 ms. En mode VS, le dernier joueur encore en vie gagne; les joueurs éliminés sont classés par score.

## Les trois niveaux d’IA

- **Débutant** : choisit au hasard parmi les placements légaux.
- **Intermédiaire** : évalue la hauteur moyenne, les trous et les lignes complétées, puis choisit le meilleur placement selon son heuristique.
- **Expert** : évalue la hauteur agrégée, les lignes, les trous et l’irrégularité avec les pondérations `-0.51`, `0.76`, `-0.36` et `-0.18`. Il anticipe aussi la meilleure pose possible de la pièce suivante.

Les IA exécutent leur décision progressivement, via les mêmes mouvements et rotations que le joueur. Le délai par action est de 300 ms (débutant), 200 ms (intermédiaire) et 100 ms (expert).

## Commandes de développement

```bash
npm test             # Lance tous les tests Vitest
npm run coverage     # Lance les tests et vérifie la couverture de src/core
npm run simulate     # Simule 20 parties par niveau avec une graine fixe
```

Le simulateur affiche la moyenne de lignes complétées pour chaque niveau et échoue si l’expert ne dépasse pas le débutant. La suite actuelle comporte des tests unitaires pour les règles de grille, les pièces, le score, les parties, les IA, les entrées et le rendu.

## Structure du projet

- `src/core/` : règles pures de grille, pièces, score, moteur, parties, gestionnaire multijoueur et IA.
- `src/ui/` : rendu Canvas et commandes clavier.
- `main.js` : relie le cœur de jeu à l’interface du navigateur.
- `tests/` : tests Vitest.
- `docs/ARCHITECTURE.md` : diagrammes de classes et de séquence.
