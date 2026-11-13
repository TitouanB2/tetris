import {
    clearFullLines,
    createGrid,
    GRID_WIDTH,
    hasCollision,
    placePiece
} from "./grid.js";
import { PIECES, PIECE_COLORS, rotate } from "./piece.js";
import { calculateLevel, calculateLineScore, getDropInterval } from "./scoring.js";

const PIECE_TYPES = Object.keys(PIECES);

export const createSeededRng = (seed) => {
    if (!Number.isInteger(seed)) {
        throw new Error("La graine doit être un entier");
    }

    let state = seed >>> 0;
    return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 0x100000000;
    };
};

const getRandomPieceType = (rng) => {
    const value = rng();
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value >= 1) {
        throw new Error("Le générateur aléatoire doit retourner un nombre entre 0 inclus et 1 exclu");
    }
    return PIECE_TYPES[Math.floor(value * PIECE_TYPES.length)];
};

const createPiece = (type) => {
    const matrix = PIECES[type].map((row) => [...row]);
    return {
        type,
        matrix,
        x: Math.floor((GRID_WIDTH - matrix[0].length) / 2),
        y: 0
    };
};

export const createGame = ({ rng, seed } = {}) => {
    if (rng !== undefined && seed !== undefined) {
        throw new Error("Fournissez une graine ou un générateur aléatoire, pas les deux");
    }

    const random = rng === undefined
        ? (seed === undefined ? Math.random : createSeededRng(seed))
        : rng;
    if (typeof random !== "function") {
        throw new Error("Le générateur aléatoire doit être une fonction");
    }

    const currentPiece = createPiece(getRandomPieceType(random));
    const nextPiece = getRandomPieceType(random);

    return {
        grid: createGrid(),
        currentPiece,
        nextPiece,
        status: "playing",
        lastClearedLines: 0,
        score: 0,
        lines: 0,
        level: 1,
        dropInterval: getDropInterval(1),
        rng: random
    };
};

const lockCurrentPiece = (state) => {
    const { currentPiece, grid, nextPiece, rng } = state;
    if (currentPiece.matrix.some((row, pieceY) => (
        row.some((cell) => cell === 1 && currentPiece.y + pieceY < 0)
    ))) {
        return { ...state, status: "gameOver", lastClearedLines: 0 };
    }

    const lockedGrid = placePiece(
        grid,
        currentPiece.matrix,
        currentPiece.x,
        currentPiece.y,
        PIECE_COLORS[currentPiece.type]
    );
    const { grid: clearedGrid, clearedLines } = clearFullLines(lockedGrid);
    const spawnedPiece = createPiece(nextPiece);
    const lines = state.lines + clearedLines;
    const level = calculateLevel(lines);
    const progression = {
        score: state.score + calculateLineScore(clearedLines),
        lines,
        level,
        dropInterval: getDropInterval(level),
        lastClearedLines: clearedLines
    };

    if (hasCollision(clearedGrid, spawnedPiece.matrix, spawnedPiece.x, spawnedPiece.y)) {
        return {
            ...state,
            grid: clearedGrid,
            currentPiece: spawnedPiece,
            status: "gameOver",
            ...progression
        };
    }

    return {
        ...state,
        grid: clearedGrid,
        currentPiece: spawnedPiece,
        nextPiece: getRandomPieceType(rng),
        ...progression
    };
};

export const movePiece = (state, dx, dy) => {
    if (!Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) {
        throw new Error("Un déplacement doit être d'une case horizontale ou verticale");
    }
    if (state.status !== "playing") {
        return state;
    }

    const { currentPiece } = state;
    const movedPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };

    if (hasCollision(state.grid, movedPiece.matrix, movedPiece.x, movedPiece.y)) {
        if (dy > 0) {
            return lockCurrentPiece({ ...state, lastClearedLines: 0 });
        }
        return state;
    }

    return { ...state, currentPiece: movedPiece, lastClearedLines: 0 };
};

export const rotateCurrentPiece = (state) => {
    if (state.status !== "playing") {
        return state;
    }

    const rotatedMatrix = rotate(state.currentPiece.matrix);
    if (hasCollision(state.grid, rotatedMatrix, state.currentPiece.x, state.currentPiece.y)) {
        return state;
    }

    return {
        ...state,
        currentPiece: { ...state.currentPiece, matrix: rotatedMatrix },
        lastClearedLines: 0
    };
};
