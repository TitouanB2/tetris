import { describe, expect, it } from "vitest";
import {
    clearFullLines,
    createGrid,
    GRID_HEIGHT,
    GRID_WIDTH,
    hasCollision,
    placePiece
} from "../src/core/grid.js";

describe("createGrid", () => {
    it("crée par défaut une grille vide de 10x20", () => {
        const grid = createGrid();

        expect(grid).toHaveLength(GRID_HEIGHT);
        expect(grid.every((row) => row.length === GRID_WIDTH && row.every((cell) => cell === 0)))
            .toBe(true);
    });

    it("permet de créer une grille aux dimensions demandées", () => {
        expect(createGrid(4, 3)).toEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]);
    });
});

describe("hasCollision", () => {
    const singleBlock = [[1]];

    it("détecte les limites gauche, droite et basse", () => {
        const grid = createGrid(4, 3);

        expect(hasCollision(grid, singleBlock, -1, 0)).toBe(true);
        expect(hasCollision(grid, singleBlock, 4, 0)).toBe(true);
        expect(hasCollision(grid, singleBlock, 0, 3)).toBe(true);
    });

    it("détecte les blocs déjà posés et autorise une pièce au-dessus de la grille", () => {
        const grid = placePiece(createGrid(4, 3), singleBlock, 1, 1);

        expect(hasCollision(grid, singleBlock, 1, 1)).toBe(true);
        expect(hasCollision(createGrid(4, 3), [[0], [1]], 1, -1)).toBe(false);
    });
});

describe("placePiece", () => {
    it("pose une pièce sans modifier la grille d'origine", () => {
        const grid = createGrid(4, 3);
        const placedGrid = placePiece(grid, [[1, 1]], 1, 1, "T");

        expect(placedGrid[1]).toEqual([0, "T", "T", 0]);
        expect(grid[1]).toEqual([0, 0, 0, 0]);
    });

    it("refuse de poser une pièce en collision ou partiellement au-dessus de la grille", () => {
        const grid = createGrid(4, 3);

        expect(() => placePiece(grid, [[1]], -1, 0)).toThrow("collision");
        expect(() => placePiece(grid, [[1], [1]], 0, -1)).toThrow("entièrement dans la grille");
    });
});

describe("clearFullLines", () => {
    it("supprime les lignes complètes et laisse tomber les lignes au-dessus", () => {
        const grid = [
            ["A", 0, 0, 0],
            [1, 1, 1, 1],
            [2, 0, 0, 0],
            [3, 3, 3, 3]
        ];

        expect(clearFullLines(grid)).toEqual({
            grid: [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                ["A", 0, 0, 0],
                [2, 0, 0, 0]
            ],
            clearedLines: 2
        });
        expect(grid[1]).toEqual([1, 1, 1, 1]);
    });
});
