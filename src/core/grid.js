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

/**
 * Crée une grille vide dont chaque case vaut zéro.
 * @param {number} [width=GRID_WIDTH] Nombre de colonnes.
 * @param {number} [height=GRID_HEIGHT] Nombre de lignes.
 * @returns {number[][]} Nouvelle grille indépendante.
 * @throws {Error} Si la largeur ou la hauteur n'est pas un entier positif.
 */
export const createGrid = (width = GRID_WIDTH, height = GRID_HEIGHT) => {
    if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
        throw new Error("La largeur et la hauteur doivent être des entiers positifs");
    }

    return Array.from({ length: height }, () => Array(width).fill(0));
};

/**
 * Vérifie si une pièce entre en collision avec les limites ou les cases occupées.
 * Les cases de la pièce situées au-dessus de la grille ne sont pas bloquantes.
 * @param {Array<Array<number|string>>} grid Grille de jeu rectangulaire.
 * @param {number[][]} piece Matrice de la pièce composée de zéros et de uns.
 * @param {number} x Coordonnée horizontale de la pièce.
 * @param {number} y Coordonnée verticale de la pièce.
 * @returns {boolean} Vrai si la pièce entre en collision.
 * @throws {Error} Si la grille, la pièce ou les coordonnées sont invalides.
 */
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

/**
 * Pose une pièce dans une copie de la grille sans modifier la grille d'origine.
 * @param {Array<Array<number|string>>} grid Grille de jeu rectangulaire.
 * @param {number[][]} piece Matrice de la pièce composée de zéros et de uns.
 * @param {number} x Coordonnée horizontale de la pièce.
 * @param {number} y Coordonnée verticale de la pièce.
 * @param {number|string} [value=1] Valeur inscrite dans les cases occupées.
 * @returns {Array<Array<number|string>>} Nouvelle grille avec la pièce posée.
 * @throws {Error} Si les entrées sont invalides, si la pièce entre en collision ou reste au-dessus de la grille.
 */
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

/**
 * Supprime les lignes complètes et ajoute des lignes vides en haut de la grille.
 * @param {Array<Array<number|string>>} grid Grille de jeu rectangulaire.
 * @returns {{grid: Array<Array<number|string>>, clearedLines: number}} Grille résultante et nombre de lignes supprimées.
 * @throws {Error} Si la grille n'est pas rectangulaire ou est vide.
 */
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
