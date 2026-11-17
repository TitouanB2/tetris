import { describe, expect, it, vi } from "vitest";
import { setupInput } from "../src/ui/input.js";

const createEventTarget = () => {
    const listeners = new Map();
    return {
        addEventListener: (type, listener) => listeners.set(type, listener),
        removeEventListener: (type) => listeners.delete(type),
        dispatch: (event) => listeners.get(event.type)?.(event)
    };
};

const createKeyEvent = (key, { repeat = false } = {}) => ({
    type: "keydown",
    key,
    repeat,
    target: { matches: () => false },
    preventDefault: vi.fn()
});

describe("setupInput", () => {
    it("associe les flèches aux déplacements et à la rotation", () => {
        const target = createEventTarget();
        const onMove = vi.fn();
        const onRotate = vi.fn();
        const onTogglePause = vi.fn();
        setupInput({ target, onMove, onRotate, onTogglePause });

        const left = createKeyEvent("ArrowLeft");
        const right = createKeyEvent("ArrowRight");
        const down = createKeyEvent("ArrowDown");
        target.dispatch(left);
        target.dispatch(right);
        target.dispatch(down);
        target.dispatch(createKeyEvent("ArrowUp"));

        expect(onMove.mock.calls).toEqual([[0, -1, 0], [0, 1, 0], [0, 0, 1]]);
        expect(onRotate).toHaveBeenCalledWith(0);
        expect(left.preventDefault).toHaveBeenCalledOnce();
        expect(right.preventDefault).toHaveBeenCalledOnce();
        expect(down.preventDefault).toHaveBeenCalledOnce();
    });

    it("bascule la pause sans répéter la touche et permet de retirer l'écouteur", () => {
        const target = createEventTarget();
        const onTogglePause = vi.fn();
        const cleanup = setupInput({
            target,
            onMove: vi.fn(),
            onRotate: vi.fn(),
            onTogglePause
        });

        target.dispatch(createKeyEvent("p"));
        target.dispatch(createKeyEvent("P", { repeat: true }));
        cleanup();
        target.dispatch(createKeyEvent("p"));

        expect(onTogglePause).toHaveBeenCalledOnce();
    });

    it("ignore les commandes clavier lorsqu'un champ de saisie est ciblé", () => {
        const target = createEventTarget();
        const onMove = vi.fn();
        setupInput({
            target,
            onMove,
            onRotate: vi.fn(),
            onTogglePause: vi.fn()
        });
        const event = createKeyEvent("ArrowLeft");
        event.target.matches = () => true;

        target.dispatch(event);

        expect(onMove).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("attribue des touches distinctes aux trois adversaires", () => {
        const target = createEventTarget();
        const onMove = vi.fn();
        const onRotate = vi.fn();
        setupInput({
            target,
            playerCount: 4,
            onMove,
            onRotate,
            onTogglePause: vi.fn()
        });

        ["d", "h", "l"].forEach((key) => target.dispatch(createKeyEvent(key)));
        ["w", "t", "i"].forEach((key) => target.dispatch(createKeyEvent(key)));

        expect(onMove.mock.calls).toEqual([[1, 1, 0], [2, 1, 0], [3, 1, 0]]);
        expect(onRotate.mock.calls).toEqual([[1], [2], [3]]);
    });

    it("rejette un nombre de joueurs hors limites", () => {
        expect(() => setupInput({
            target: createEventTarget(),
            playerCount: 5,
            onMove: vi.fn(),
            onRotate: vi.fn(),
            onTogglePause: vi.fn()
        })).toThrow("compris entre 1 et 4");
    });
});
