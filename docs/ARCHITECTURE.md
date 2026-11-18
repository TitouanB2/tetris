# Architecture

Le cœur (`src/core`) porte les règles de jeu sans dépendre du DOM. L’interface (`src/ui`) dessine les états et traduit les commandes clavier. `main.js` relie les deux couches.

## Diagramme de classes

```mermaid
classDiagram
    class GameInstance {
        +name
        +state
        +grid
        +currentPiece
        +score
        +level
        +isAlive
        +move(dx, dy)
        +rotate()
        +update(elapsedMs)
    }
    class GameManager {
        +instances
        +aiPlayers
        +status
        +winner
        +podium
        +movePlayer(index, dx, dy)
        +rotatePlayer(index)
        +update(elapsedMs)
    }
    class AIPlayer {
        +level
        +delay
        +decide(grid, piece, next)
        +update(instance, elapsedMs, controls)
    }
    class GridRules {
        <<module>>
        +createGrid()
        +hasCollision()
        +placePiece()
        +clearFullLines()
    }
    class GameRules {
        <<module>>
        +createGame()
        +movePiece()
        +rotateCurrentPiece()
    }
    class PieceRules {
        <<module>>
        +PIECES
        +PIECE_COLORS
        +rotate()
    }
    class ScoringRules {
        <<module>>
        +calculateLineScore()
        +calculateLevel()
        +getDropInterval()
    }
    class Renderer {
        <<module>>
        +renderGame()
    }
    class Input {
        <<module>>
        +setupInput()
    }
    class Main {
        <<module>>
        +createManager()
        +render()
    }

    GameManager "1" o-- "1..4" GameInstance : orchestre
    GameManager "1" o-- "0..3" AIPlayer : associe aux adversaires
    GameManager ..> GameRules : générateur à graine
    AIPlayer ..> GameInstance : décide puis commande
    GameInstance ..> GameRules : applique les actions
    GameRules ..> GridRules : collisions et pose
    GameRules ..> PieceRules : catalogue et rotations
    GameRules ..> ScoringRules : progression et points
    AIPlayer ..> GridRules : évalue les placements
    AIPlayer ..> PieceRules : explore les rotations
    Renderer ..> GridRules : dimensions du plateau
    Renderer ..> PieceRules : aperçu et couleurs
    Main ..> GameManager : crée et met à jour
    Main ..> Input : configure les callbacks
    Main ..> Renderer : transmet les états à dessiner
```

## Séquence d’un tour de jeu

Le navigateur appelle périodiquement `GameManager.update`. Les parties avancent, les IA décident d’une action à la fois, puis les actions passent par les mêmes méthodes de `GameInstance` que les commandes humaines. L’interface rend ensuite l’état actualisé.

```mermaid
sequenceDiagram
    actor Joueur
    participant Input
    participant Main as main.js
    participant Manager as GameManager
    participant Instance as GameInstance
    participant IA as AIPlayer
    participant Rules as game.js / grid.js
    participant Renderer as renderGame

    Joueur->>Input: touche de déplacement ou rotation
    Input->>Main: callback de commande
    Main->>Manager: movePlayer / rotatePlayer
    Manager->>Instance: move / rotate
    Instance->>Rules: movePiece / rotateCurrentPiece
    Rules-->>Instance: nouvel état

    loop chaque tick
        Main->>Manager: update(elapsedMs)
        Manager->>Instance: update(elapsedMs)
        Manager->>IA: update(instance, elapsedMs)
        IA->>IA: décide d'une action pour le placement cible
        IA->>Manager: movePlayer / rotatePlayer
        Manager->>Instance: move / rotate
        Instance->>Rules: appliquer l'action
        Rules-->>Instance: état actualisé
        Manager->>Manager: synchroniser éliminations et fin de match
        Main->>Renderer: renderGame(instance.state)
        Renderer-->>Main: plateaux et aperçus dessinés
    end
```
