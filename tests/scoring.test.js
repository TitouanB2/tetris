import { describe, expect, it } from "vitest";
import {
    calculateLevel,
    calculateLineScore,
    getDropInterval
} from "../src/core/scoring.js";

describe("calculateLineScore", () => {
    it.each([
        [0, 0],
        [1, 100],
        [2, 300],
        [3, 500],
        [4, 800]
    ])("attribue %i ligne(s) pour %i points", (clearedLines, expectedScore) => {
        expect(calculateLineScore(clearedLines)).toBe(expectedScore);
    });

    it("rejette un nombre de lignes invalide", () => {
        expect(() => calculateLineScore(5)).toThrow("de 0 à 4");
        expect(() => calculateLineScore(1.5)).toThrow("de 0 à 4");
    });
});

describe("calculateLevel", () => {
    it.each([
        [0, 1],
        [9, 1],
        [10, 2],
        [19, 2],
        [20, 3]
    ])("calcule le niveau %i après %i ligne(s)", (totalLines, expectedLevel) => {
        expect(calculateLevel(totalLines)).toBe(expectedLevel);
    });
});

describe("getDropInterval", () => {
    it("accélère la chute à chaque niveau et respecte l'intervalle minimal", () => {
        expect(getDropInterval(1)).toBe(1000);
        expect(getDropInterval(2)).toBe(900);
        expect(getDropInterval(10)).toBe(100);
        expect(getDropInterval(11)).toBe(100);
    });

    it("rejette un niveau invalide", () => {
        expect(() => getDropInterval(0)).toThrow("entier positif");
        expect(() => getDropInterval(1.5)).toThrow("entier positif");
    });
});
