import { describe, expect, it } from "vitest";
import { GameInstance } from "../src/core/game-instance.js";

describe("GameInstance", () => {
    it("encapsule le pseudo et l'état complet d'une partie", () => {
        const game = new GameInstance({ name: "  Ada  ", seed: 12 });

        expect(game.name).toBe("Ada");
        expect(game.grid).toHaveLength(20);
        expect(game.currentPiece).toBe(game.state.currentPiece);
        expect(game.nextPiece).toBe(game.state.nextPiece);
        expect(game.score).toBe(0);
        expect(game.level).toBe(1);
        expect(game.isAlive).toBe(true);
    });

    it("garde les grilles et transitions de deux parties indépendantes", () => {
        const first = new GameInstance({ name: "Joueur 1", seed: 1 });
        const second = new GameInstance({ name: "Joueur 2", seed: 2 });
        const secondState = second.state;

        first.move(1, 0);

        expect(first.state).not.toBe(secondState);
        expect(second.currentPiece.x).toBe(Math.floor((10 - second.currentPiece.matrix[0].length) / 2));
    });

    it("fait tomber les pièces selon le temps écoulé et valide ce temps", () => {
        const game = new GameInstance({ seed: 7 });
        const initialY = game.currentPiece.y;

        game.update(999);
        expect(game.currentPiece.y).toBe(initialY);
        game.update(1);
        expect(game.currentPiece.y).toBe(initialY + 1);
        expect(() => game.update(-1)).toThrow("positif ou nul");
    });

    it("accepte les commandes de déplacement et de rotation de la partie", () => {
        const game = new GameInstance({ seed: 33 });
        const initialX = game.currentPiece.x;

        game.move(1, 0);
        expect(game.currentPiece.x).toBe(initialX + 1);
        expect(game.rotate()).toBe(game.state);
    });

    it("rejette un pseudo vide", () => {
        expect(() => new GameInstance({ name: " " })).toThrow("ne peut pas être vide");
    });

    it("ignore déplacement, rotation et temps lorsque la partie est terminée", () => {
        const game = new GameInstance({ seed: 2 });
        game.state = { ...game.state, status: "gameOver" };

        expect(game.move(1, 0)).toBe(game.state);
        expect(game.rotate()).toBe(game.state);
        expect(game.update(1000)).toBe(game.state);
        expect(game.isAlive).toBe(false);
    });
});
