import { describe, expect, it } from "vitest";
import { createGrid, placePiece } from "../src/core/grid.js";
import {
    createGame,
    createSeededRng,
    movePiece,
    rotateCurrentPiece
} from "../src/core/game.js";
import { PIECES } from "../src/core/piece.js";

const pieceSequence = (...values) => {
    let index = 0;
    return () => values[index++ % values.length];
};

const dropUntilPieceLocks = (state) => {
    for (let step = 0; step < 21; step += 1) {
        const previousGrid = state.grid;
        state = movePiece(state, 0, 1);
        if (state.grid !== previousGrid || state.status === "gameOver") {
            return state;
        }
    }
    throw new Error("La pièce n'a pas été verrouillée");
};

describe("createGame", () => {
    it("crée une partie reproductible avec une graine", () => {
        const first = createGame({ seed: 42 });
        const second = createGame({ seed: 42 });

        expect(first.currentPiece.type).toBe(second.currentPiece.type);
        expect(first.nextPiece).toBe(second.nextPiece);
        expect(first.grid).toEqual(createGrid());
        expect(first.status).toBe("playing");
        expect(first.score).toBe(0);
        expect(first.lines).toBe(0);
        expect(first.level).toBe(1);
        expect(first.dropInterval).toBe(1000);
    });

    it("permet d'injecter un générateur et rejette ses valeurs invalides", () => {
        expect(createGame({ rng: () => 0 }).currentPiece.type).toBe("I");
        expect(() => createGame({ rng: () => 1 })).toThrow("générateur aléatoire");
        expect(() => createGame({ rng: () => 0, seed: 1 })).toThrow("pas les deux");
        expect(() => createSeededRng(1.5)).toThrow("entier");
    });
});

describe("movePiece", () => {
    it("déplace la pièce active sans franchir le bord", () => {
        const initial = createGame({ rng: () => 0 });
        const atLeftEdge = movePiece(movePiece(movePiece(initial, -1, 0), -1, 0), -1, 0);

        expect(atLeftEdge.currentPiece.x).toBe(0);
        expect(movePiece(atLeftEdge, -1, 0)).toBe(atLeftEdge);
        expect(() => movePiece(atLeftEdge, 1, 1)).toThrow("d'une case");
    });

    it("verrouille la pièce au sol puis fait apparaître la suivante", () => {
        const initial = createGame({ rng: pieceSequence(0, 0.15, 0.3) });
        const locked = dropUntilPieceLocks(initial);

        expect(locked.status).toBe("playing");
        expect(locked.grid.some((row) => row.includes("#00FFFF"))).toBe(true);
        expect(locked.currentPiece.type).toBe(initial.nextPiece);
        expect(locked.nextPiece).toBe("T");
    });

    it("supprime les lignes complètes au verrouillage", () => {
        const initial = createGame({ rng: () => 0 });
        const grid = createGrid();
        grid[19] = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
        const state = { ...initial, grid };
        const locked = dropUntilPieceLocks(state);

        expect(locked.lastClearedLines).toBe(1);
        expect(locked.score).toBe(100);
        expect(locked.lines).toBe(1);
        expect(locked.level).toBe(1);
        expect(locked.grid[0]).toEqual(Array(10).fill(0));
        expect(locked.grid[19]).toEqual(Array(10).fill(0));
    });

    it("augmente le niveau et accélère la chute toutes les dix lignes", () => {
        const initial = createGame({ rng: () => 0 });
        const grid = createGrid();
        grid[19] = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
        const state = { ...initial, grid, score: 1200, lines: 9 };
        const locked = dropUntilPieceLocks(state);

        expect(locked.score).toBe(1300);
        expect(locked.lines).toBe(10);
        expect(locked.level).toBe(2);
        expect(locked.dropInterval).toBe(900);
    });

    it("termine la partie si la pièce suivante ne peut pas apparaître", () => {
        const initial = createGame({ rng: pieceSequence(0.3, 0.15, 0) });
        const grid = placePiece(initial.grid, [[1]], 5, 0);
        const blockedSpawn = { ...initial, grid };
        const ended = dropUntilPieceLocks(blockedSpawn);

        expect(ended.status).toBe("gameOver");
        expect(ended.currentPiece.type).toBe("O");
    });

    it("ne modifie pas une partie terminée", () => {
        const gameOver = { ...createGame({ rng: () => 0 }), status: "gameOver" };

        expect(movePiece(gameOver, 0, 1)).toBe(gameOver);
        expect(rotateCurrentPiece(gameOver)).toBe(gameOver);
    });
});

describe("rotateCurrentPiece", () => {
    it("réutilise rotate pour faire pivoter la pièce active", () => {
        const state = createGame({ rng: () => 0.3 });

        expect(state.currentPiece.type).toBe("T");
        expect(rotateCurrentPiece(state).currentPiece.matrix).not.toEqual(PIECES.T);
    });

    it("refuse une rotation qui entrerait en collision", () => {
        const initial = createGame({ rng: () => 0.3 });
        const grid = placePiece(initial.grid, [[1]], initial.currentPiece.x + 1, 2);
        const state = { ...initial, grid };

        expect(rotateCurrentPiece(state)).toBe(state);
    });
});
