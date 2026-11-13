import { describe, expect, it } from "vitest";
import { PIECES, PIECE_COLORS, rotate } from "../src/core/piece.js";

describe("rotate", () => {
    it("fait tourner une matrice 2x2 dans le sens horaire", () => {
        expect(rotate([
            [1, 2],
            [3, 4]
        ])).toEqual([
            [3, 1],
            [4, 2]
        ]);
    });

    it("fait tourner une matrice 3x3 dans le sens horaire", () => {
        expect(rotate([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ])).toEqual([
            [7, 4, 1],
            [8, 5, 2],
            [9, 6, 3]
        ]);
    });

    it("lève une erreur pour une matrice non carrée", () => {
        expect(() => rotate([
            [1, 2, 3],
            [4, 5]
        ])).toThrow("La matrice doit être carrée");
    });
});

describe("PIECES", () => {
    it("définit les sept tétriminos avec leurs couleurs standard", () => {
        expect(Object.keys(PIECES)).toEqual(["I", "O", "T", "S", "Z", "J", "L"]);
        expect(PIECE_COLORS).toEqual({
            I: "#00FFFF",
            O: "#FFFF00",
            T: "#800080",
            S: "#00FF00",
            Z: "#FF0000",
            J: "#0000FF",
            L: "#FFA500"
        });
    });

    it("représente chaque tétrimino par une matrice carrée de quatre blocs", () => {
        for (const matrix of Object.values(PIECES)) {
            expect(matrix.every((row) => row.length === matrix.length)).toBe(true);
            expect(matrix.flat().filter((cell) => cell === 1)).toHaveLength(4);
        }
    });
});
