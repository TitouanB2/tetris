import { describe, expect, it, vi } from "vitest";
import { createGame } from "../src/core/game.js";
import { renderGame } from "../src/ui/renderer.js";

const createCanvas = ({ reducedMotion = false } = {}) => {
    const context = {
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fillText: vi.fn()
    };

    return {
        context,
        canvas: {
            getContext: () => context,
            animate: vi.fn(),
            ownerDocument: {
                defaultView: {
                    matchMedia: () => ({ matches: reducedMotion })
                }
            }
        }
    };
};

describe("renderGame", () => {
    it("anime une seule fois l’état où des lignes viennent d’être supprimées", () => {
        const board = createCanvas();
        const next = createCanvas();
        const state = { ...createGame({ rng: () => 0 }), lastClearedLines: 2 };
        const renderOptions = { boardCanvas: board.canvas, nextCanvas: next.canvas, state };

        renderGame(renderOptions);
        renderGame(renderOptions);

        expect(board.canvas.animate).toHaveBeenCalledOnce();
        expect(board.canvas.animate.mock.calls[0][1].duration).toBe(300);
    });

    it("n'anime pas la suppression lorsque la réduction de mouvement est activée", () => {
        const board = createCanvas({ reducedMotion: true });
        const next = createCanvas();
        const state = { ...createGame({ rng: () => 0 }), lastClearedLines: 1 };

        renderGame({ boardCanvas: board.canvas, nextCanvas: next.canvas, state });

        expect(board.canvas.animate).not.toHaveBeenCalled();
    });
});
