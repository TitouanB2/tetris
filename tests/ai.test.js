import { describe, expect, it } from "vitest";
import { AIPlayer, evaluateBoard } from "../src/core/ai.js";
import { createGrid, hasCollision } from "../src/core/grid.js";
import { GameInstance } from "../src/core/game-instance.js";
import { PIECES, rotate } from "../src/core/piece.js";

const createPiece = (type = "T") => ({
    matrix: PIECES[type].map((row) => [...row]),
    x: 3,
    y: 0
});

const createLineGapGrid = () => {
    const grid = createGrid();
    grid[grid.length - 1].forEach((_, column) => {
        if (column !== 4 && column !== 5) {
            grid[grid.length - 1][column] = 1;
        }
    });
    return grid;
};

const playDecision = (instance, decision) => {
    for (let count = 0; count < decision.rotation; count += 1) {
        instance.rotate();
        expect(instance.isAlive).toBe(true);
    }

    while (instance.currentPiece.x !== decision.column) {
        const direction = decision.column < instance.currentPiece.x ? -1 : 1;
        instance.move(direction, 0);
        expect(instance.isAlive).toBe(true);
    }

    const initialGrid = instance.grid;
    for (let count = 0; instance.grid === initialGrid && count < 25; count += 1) {
        instance.move(0, 1);
        expect(instance.isAlive).toBe(true);
    }
    expect(instance.grid).not.toBe(initialGrid);
};

const verifyPlacement = (grid, piece, placement) => {
    let matrix = piece.matrix;
    for (let count = 0; count < placement.rotation; count += 1) {
        matrix = rotate(matrix);
    }

    let y = piece.y;
    expect(hasCollision(grid, matrix, placement.column, y)).toBe(false);
    while (!hasCollision(grid, matrix, placement.column, y + 1)) {
        y += 1;
    }
    expect(hasCollision(grid, matrix, placement.column, y)).toBe(false);
    expect(hasCollision(grid, matrix, placement.column, y + 1)).toBe(true);
};

describe("AIPlayer", () => {
    it("évalue hauteur moyenne, hauteur agrégée, trous et irrégularité", () => {
        const gridWithHole = createGrid();
        gridWithHole[17][0] = 1;
        gridWithHole[19][0] = 1;

        const holeEvaluation = evaluateBoard(gridWithHole, 0, "intermediate");
        expect(holeEvaluation).toMatchObject({
            averageHeight: 0.3,
            aggregateHeight: 3,
            holes: 1,
            roughness: 3
        });
        expect(holeEvaluation.score).toBeCloseTo(-0.95);

        const unevenGrid = createGrid();
        unevenGrid[18][0] = 1;
        unevenGrid[19][0] = 1;
        unevenGrid[19][1] = 1;

        expect(evaluateBoard(unevenGrid, 2, "expert")).toMatchObject({
            averageHeight: 0.3,
            aggregateHeight: 3,
            holes: 0,
            roughness: 2,
            score: -0.37
        });
    });

    it("permet de modifier les pondérations expertes sans changer les valeurs par défaut", () => {
        const grid = createGrid();
        grid[18][0] = 1;
        grid[19][0] = 1;

        expect(evaluateBoard(grid, 1, "expert").score).toBeCloseTo(-0.62);
        expect(evaluateBoard(grid, 1, "expert", {
            height: -0.51,
            lines: 1.52,
            holes: -0.36,
            roughness: -0.18
        }).score).toBeCloseTo(0.14);
        expect(() => new AIPlayer({
            level: "expert",
            expertWeights: { lines: Number.NaN }
        })).toThrow("nombres finis");
        expect(() => evaluateBoard(grid, 1, "expert", { typo: 1 })).toThrow("nombres finis");
        expect(() => evaluateBoard(grid, 1, "expert", 1)).toThrow("nombres finis");
    });

    it("préfère le placement qui complète une ligne évidente", () => {
        const grid = createLineGapGrid();
        const piece = { ...createPiece("O"), x: 4 };
        const ai = new AIPlayer({ level: "intermediate" });

        expect(ai.decide(grid, piece, "I")).toEqual({ rotation: 0, column: 4 });
    });

    it.each(["beginner", "intermediate", "expert"])(
        "joue chaque décision %s par les méthodes publiques de GameInstance",
        (level) => {
            const instance = new GameInstance({ seed: 39 });
            instance.state = {
                ...instance.state,
                grid: createLineGapGrid(),
                currentPiece: { ...createPiece("O"), x: 4 }
            };
            const ai = new AIPlayer({ level, rng: () => 0 });
            const decision = ai.decide(instance.grid, instance.currentPiece, instance.nextPiece);

            playDecision(instance, decision);
        }
    );

    it("choisit un placement légal au niveau débutant sans modifier la grille", () => {
        const grid = createGrid();
        const piece = createPiece();
        const initialGrid = grid.map((row) => [...row]);
        const ai = new AIPlayer({ level: "beginner", rng: () => 0 });

        const placement = ai.decide(grid, piece, "I");

        verifyPlacement(grid, piece, placement);
        expect(grid).toEqual(initialGrid);
        expect(piece).toEqual(createPiece());
    });

    it.each(["intermediate", "expert"])("évalue les placements au niveau %s", (level) => {
        const grid = createGrid();
        const piece = createPiece("L");
        const ai = new AIPlayer({ level, rng: () => 0 });

        const placement = ai.decide(grid, piece, "O");

        verifyPlacement(grid, piece, placement);
        expect(Number.isInteger(placement.rotation)).toBe(true);
        expect(Number.isInteger(placement.column)).toBe(true);
    });

    it("accepte une pièce suivante sous forme de matrice", () => {
        const ai = new AIPlayer({ level: "expert" });

        expect(() => ai.decide(createGrid(), createPiece(), PIECES.I)).not.toThrow();
    });

    it("respecte le délai du niveau et exécute une action à la fois", () => {
        const instance = new GameInstance({ seed: 19 });
        const ai = new AIPlayer({ level: "expert", rng: () => 0 });
        const initialState = instance.state;

        ai.update(instance, 99);
        expect(instance.state).toBe(initialState);

        ai.update(instance, 1);
        expect(instance.state).not.toBe(initialState);
        expect(ai.elapsedMs).toBe(0);
    });

    it("valide le niveau, le générateur et les décisions impossibles", () => {
        expect(() => new AIPlayer({ level: "impossible" })).toThrow("niveau de l'IA");
        expect(() => new AIPlayer({ rng: 1 })).toThrow("générateur aléatoire");
        expect(() => new AIPlayer({ level: "beginner", rng: () => 1 }).decide(
            createGrid(),
            createPiece(),
            "I"
        )).toThrow("entre 0 et 1");
        expect(() => new AIPlayer({ level: "expert" }).decide(
            createGrid(),
            createPiece(),
            "unknown"
        )).toThrow("prochaine pièce");
        expect(() => new AIPlayer().decide(
            createGrid(),
            { matrix: [[1]], x: 20, y: 0 },
            "I"
        )).toThrow("aucun placement");
    });

    it("rejette un temps négatif et ignore une partie terminée", () => {
        const instance = new GameInstance({ seed: 19 });
        const ai = new AIPlayer();
        instance.state = { ...instance.state, status: "gameOver" };

        expect(() => ai.update(instance, -1)).toThrow("positif ou nul");
        expect(ai.update(instance, 1000)).toBe(instance.state);
    });
});
