import { clearFullLines, hasCollision, placePiece } from "./grid.js";
import { PIECES, rotate } from "./piece.js";

export const AI_LEVELS = ["beginner", "intermediate", "expert"];

const AI_SETTINGS = {
    beginner: { label: "Débutant", delay: 300 },
    intermediate: { label: "Intermédiaire", delay: 200 },
    expert: { label: "Expert", delay: 100 }
};

const DEFAULT_EXPERT_WEIGHTS = {
    height: -0.51,
    lines: 0.76,
    holes: -0.36,
    roughness: -0.18
};

const copyMatrix = (matrix) => matrix.map((row) => [...row]);

const getOrientations = (matrix) => {
    const orientations = [copyMatrix(matrix)];
    for (let rotation = 1; rotation < 4; rotation += 1) {
        orientations.push(rotate(orientations[rotation - 1]));
    }
    return orientations;
};

const sameMatrix = (left, right) => (
    left.length === right.length
    && left.every((row, y) => row.length === right[y].length
        && row.every((cell, x) => cell === right[y][x]))
);

const getMatrixKey = (matrix) => matrix.map((row) => row.join("")).join("/");

const collides = (grid, piece, x, y) => piece.some((row, pieceY) => row.some((cell, pieceX) => {
    if (cell === 0) {
        return false;
    }

    const gridX = x + pieceX;
    const gridY = y + pieceY;
    return gridX < 0
        || gridX >= grid[0].length
        || gridY >= grid.length
        || (gridY >= 0 && grid[gridY][gridX] !== 0);
}));

const findPath = (grid, piece, baseMatrix, target) => {
    const orientations = getOrientations(baseMatrix);
    const initialRotation = orientations.findIndex((matrix) => sameMatrix(matrix, piece.matrix));
    if (initialRotation < 0) {
        return null;
    }

    const queue = [{ rotation: initialRotation, column: piece.x, actions: [] }];
    const visited = new Set([`${initialRotation},${piece.x}`]);
    const transitions = [
        { rotation: 0, column: -1, action: "left" },
        { rotation: 0, column: 1, action: "right" },
        { rotation: 1, column: 0, action: "rotate" }
    ];

    for (let index = 0; index < queue.length; index += 1) {
        const current = queue[index];
        if (current.rotation === target.rotation && current.column === target.column) {
            return current.actions;
        }

        for (const transition of transitions) {
            const rotation = (current.rotation + transition.rotation) % 4;
            const column = current.column + transition.column;
            const key = `${rotation},${column}`;
            if (
                visited.has(key)
                || collides(grid, orientations[rotation], column, piece.y)
            ) {
                continue;
            }
            visited.add(key);
            queue.push({
                rotation,
                column,
                actions: [...current.actions, transition.action]
            });
        }
    }
    return null;
};

const getBoardFeatures = (grid) => {
    const heights = Array(grid[0].length).fill(0);
    let holes = 0;

    for (let x = 0; x < grid[0].length; x += 1) {
        let foundBlock = false;
        for (let y = 0; y < grid.length; y += 1) {
            if (grid[y][x] !== 0) {
                if (!foundBlock) {
                    heights[x] = grid.length - y;
                    foundBlock = true;
                }
            } else if (foundBlock) {
                holes += 1;
            }
        }
    }

    const aggregateHeight = heights.reduce((total, height) => total + height, 0);
    const roughness = heights.slice(1).reduce(
        (total, height, index) => total + Math.abs(height - heights[index]),
        0
    );
    return {
        averageHeight: aggregateHeight / heights.length,
        aggregateHeight,
        holes,
        roughness
    };
};

export const evaluateBoard = (grid, clearedLines, level, weights = DEFAULT_EXPERT_WEIGHTS) => {
    const { averageHeight, aggregateHeight, holes, roughness } = getBoardFeatures(grid);
    const score = level === "intermediate"
        ? -0.5 * averageHeight + 0.76 * clearedLines - 0.8 * holes
        : weights.height * aggregateHeight
            + weights.lines * clearedLines
            + weights.holes * holes
            + weights.roughness * roughness;
    return {
        averageHeight,
        aggregateHeight,
        holes,
        roughness,
        score
    };
};

const getLanding = (grid, piece, rotation, column) => {
    const matrix = rotateBy(piece.matrix, rotation);
    if (collides(grid, matrix, column, piece.y)) {
        return null;
    }

    let y = piece.y;
    while (!collides(grid, matrix, column, y + 1)) {
        y += 1;
    }
    const placedGrid = placePiece(grid, matrix, column, y);
    const { grid: clearedGrid, clearedLines } = clearFullLines(placedGrid);
    return { grid: clearedGrid, clearedLines, rotation, column };
};

const rotateBy = (matrix, rotation) => {
    let result = matrix;
    for (let count = 0; count < rotation; count += 1) {
        result = rotate(result);
    }
    return result;
};

const getPlacements = (grid, piece) => {
    hasCollision(grid, piece.matrix, piece.x, piece.y);
    const reachable = [];
    const evaluated = new Set();
    const orientations = getOrientations(piece.matrix);
    const queue = [{ rotation: 0, column: piece.x }];
    const visited = new Set([`0,${piece.x}`]);
    const transitions = [
        { rotation: 0, column: -1 },
        { rotation: 0, column: 1 },
        { rotation: 1, column: 0 }
    ];

    for (let index = 0; index < queue.length; index += 1) {
        const current = queue[index];
        const placementKey = `${getMatrixKey(orientations[current.rotation])},${current.column}`;
        if (!evaluated.has(placementKey)) {
            evaluated.add(placementKey);
            const landing = getLanding(grid, piece, current.rotation, current.column);
            if (landing) {
                reachable.push(landing);
            }
        }

        for (const transition of transitions) {
            const rotation = (current.rotation + transition.rotation) % 4;
            const column = current.column + transition.column;
            const nextKey = `${rotation},${column}`;
            if (
                visited.has(nextKey)
                || collides(grid, orientations[rotation], column, piece.y)
            ) {
                continue;
            }
            visited.add(nextKey);
            queue.push({ rotation, column });
        }
    }
    return reachable;
};

const resolveNextMatrix = (next) => {
    if (typeof next === "string" && PIECES[next]) {
        return PIECES[next];
    }
    if (Array.isArray(next)) {
        return next;
    }
    if (next && Array.isArray(next.matrix)) {
        return next.matrix;
    }
    throw new Error("La prochaine pièce de l'IA est invalide");
};

export class AIPlayer {
    constructor({ level = "intermediate", rng = Math.random, expertWeights } = {}) {
        if (!AI_LEVELS.includes(level)) {
            throw new Error("Le niveau de l'IA doit être beginner, intermediate ou expert");
        }
        if (typeof rng !== "function") {
            throw new Error("Le générateur aléatoire de l'IA doit être une fonction");
        }
        if (
            expertWeights !== undefined
            && (
                !expertWeights
                || Object.keys(DEFAULT_EXPERT_WEIGHTS).some((key) => (
                    !Number.isFinite(expertWeights[key])
                ))
            )
        ) {
            throw new Error("Les pondérations expertes doivent être des nombres finis");
        }
        this.level = level;
        this.label = AI_SETTINGS[level].label;
        this.delay = AI_SETTINGS[level].delay;
        this.rng = rng;
        this.expertWeights = { ...DEFAULT_EXPERT_WEIGHTS, ...expertWeights };
        this.elapsedMs = 0;
        this.plan = null;
    }

    decide(grid, piece, next) {
        const placements = getPlacements(grid, piece);
        if (placements.length === 0) {
            throw new Error("L'IA n'a trouvé aucun placement possible");
        }

        if (this.level === "beginner") {
            const randomValue = this.rng();
            if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
                throw new Error("Le générateur aléatoire de l'IA doit retourner une valeur entre 0 et 1");
            }
            const { rotation, column } = placements[Math.floor(randomValue * placements.length)];
            return { rotation, column };
        }

        const candidates = placements.map((placement) => {
            const { grid: resultingGrid, clearedLines, rotation, column } = placement;
            return {
                grid: resultingGrid,
                clearedLines,
                rotation,
                column,
                score: evaluateBoard(
                    resultingGrid,
                    clearedLines,
                    this.level,
                    this.expertWeights
                ).score
            };
        });
        if (this.level === "expert") {
            candidates.sort((left, right) => right.score - left.score);
            candidates.length = Math.min(candidates.length, 6);
            const nextMatrix = resolveNextMatrix(next);
            for (const candidate of candidates) {
                const nextPiece = {
                    matrix: copyMatrix(nextMatrix),
                    x: Math.floor((grid[0].length - nextMatrix[0].length) / 2),
                    y: 0
                };
                const nextPlacements = getPlacements(candidate.grid, nextPiece);
                const bestNextScore = nextPlacements.reduce(
                    (best, nextPlacement) => Math.max(
                        best,
                        evaluateBoard(
                            nextPlacement.grid,
                            nextPlacement.clearedLines,
                            "expert",
                            this.expertWeights
                        ).score
                    ),
                    Number.NEGATIVE_INFINITY
                );
                candidate.score += 0.5 * bestNextScore;
            }
        }
        candidates.sort((left, right) => right.score - left.score);
        const { rotation, column } = candidates[0];
        return { rotation, column };
    }

    update(instance, elapsedMs, controls) {
        if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
            throw new Error("Le temps écoulé doit être un nombre positif ou nul");
        }
        if (
            controls !== undefined
            && (
                typeof controls.move !== "function"
                || typeof controls.rotate !== "function"
                || typeof controls.isActive !== "function"
            )
        ) {
            throw new Error("Les commandes du gestionnaire de jeu sont invalides");
        }
        if (!instance.isAlive) {
            return instance.state;
        }

        this.elapsedMs += elapsedMs;
        while (
            this.elapsedMs >= this.delay
            && instance.isAlive
            && (controls === undefined || controls.isActive())
        ) {
            this.elapsedMs -= this.delay;
            this.advance(instance, controls);
        }
        return instance.state;
    }

    advance(instance, controls) {
        if (!this.plan || this.plan.grid !== instance.grid) {
            const baseMatrix = copyMatrix(instance.currentPiece.matrix);
            this.plan = {
                grid: instance.grid,
                baseMatrix,
                target: this.decide(instance.grid, instance.currentPiece, instance.nextPiece)
            };
        }

        let actions = findPath(
            instance.grid,
            instance.currentPiece,
            this.plan.baseMatrix,
            this.plan.target
        );
        if (actions === null) {
            this.plan = null;
            this.advance(instance, controls);
            return;
        }

        if (actions.length === 0) {
            if (controls) {
                controls.move(0, 1);
            } else {
                instance.move(0, 1);
            }
        } else if (actions[0] === "left") {
            if (controls) {
                controls.move(-1, 0);
            } else {
                instance.move(-1, 0);
            }
        } else if (actions[0] === "right") {
            if (controls) {
                controls.move(1, 0);
            } else {
                instance.move(1, 0);
            }
        } else {
            if (controls) {
                controls.rotate();
            } else {
                instance.rotate();
            }
        }

        if (this.plan.grid !== instance.grid) {
            this.plan = null;
        }
    }
}
