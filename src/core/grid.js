export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

const validateGrid = (grid) => {
    if (
        !Array.isArray(grid)
        || grid.length === 0
        || !Array.isArray(grid[0])
        || grid[0].length === 0
        || grid.some((row) => !Array.isArray(row) || row.length !== grid[0].length)
    ) {
        throw new Error("La grille doit être rectangulaire et non vide");
    }
};

const validatePiece = (piece) => {
    if (
        !Array.isArray(piece)
        || piece.length === 0
        || !Array.isArray(piece[0])
        || piece[0].length === 0
        || piece.some((row) => (
            !Array.isArray(row)
            || row.length !== piece[0].length
            || row.some((cell) => cell !== 0 && cell !== 1)
        ))
    ) {
        throw new Error("La pièce doit être une matrice rectangulaire de 0 et de 1");
    }
};

const validatePosition = (x, y) => {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
        throw new Error("La position de la pièce doit utiliser des coordonnées entières");
    }
};

export const createGrid = (width = GRID_WIDTH, height = GRID_HEIGHT) => {
    if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
        throw new Error("La largeur et la hauteur doivent être des entiers positifs");
    }

    return Array.from({ length: height }, () => Array(width).fill(0));
};

export const hasCollision = (grid, piece, x, y) => {
    validateGrid(grid);
    validatePiece(piece);
    validatePosition(x, y);

    const height = grid.length;
    const width = grid[0].length;

    return piece.some((row, pieceY) => row.some((cell, pieceX) => {
        if (cell === 0) {
            return false;
        }

        const gridX = x + pieceX;
        const gridY = y + pieceY;
        return gridX < 0
            || gridX >= width
            || gridY >= height
            || (gridY >= 0 && grid[gridY][gridX] !== 0);
    }));
};

export const placePiece = (grid, piece, x, y, value = 1) => {
    validateGrid(grid);
    validatePiece(piece);
    validatePosition(x, y);

    if (value === 0) {
        throw new Error("La valeur d'une pièce posée ne peut pas être 0");
    }
    if (hasCollision(grid, piece, x, y)) {
        throw new Error("La pièce entre en collision avec la grille");
    }

    const nextGrid = grid.map((row) => [...row]);
    piece.forEach((row, pieceY) => row.forEach((cell, pieceX) => {
        if (cell === 1) {
            const gridY = y + pieceY;
            if (gridY < 0) {
                throw new Error("La pièce doit être entièrement dans la grille pour être posée");
            }
            nextGrid[gridY][x + pieceX] = value;
        }
    }));
    return nextGrid;
};

export const clearFullLines = (grid) => {
    validateGrid(grid);

    const width = grid[0].length;
    const remainingRows = grid.filter((row) => row.some((cell) => cell === 0));
    const clearedLines = grid.length - remainingRows.length;
    const nextGrid = [
        ...Array.from({ length: clearedLines }, () => Array(width).fill(0)),
        ...remainingRows.map((row) => [...row])
    ];

    return { grid: nextGrid, clearedLines };
};
