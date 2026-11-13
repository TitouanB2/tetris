import { GRID_HEIGHT, GRID_WIDTH } from "../core/grid.js";
import { PIECES, PIECE_COLORS } from "../core/piece.js";

const CELL_SIZE = 30;
const BOARD_BACKGROUND = "#0b1220";
const GRID_COLOR = "#263449";
let lastAnimatedState = null;

const drawCell = (context, x, y, color, size = CELL_SIZE) => {
    context.fillStyle = color;
    context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
};

const drawMatrix = (context, matrix, x, y, color) => {
    matrix.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
        if (cell === 1) {
            drawCell(context, x + columnIndex, y + rowIndex, color);
        }
    }));
};

export const renderGame = ({ boardCanvas, nextCanvas, state, message = "" }) => {
    const boardContext = boardCanvas.getContext("2d");
    const nextContext = nextCanvas.getContext("2d");
    if (!boardContext || !nextContext) {
        throw new Error("Le navigateur ne permet pas de dessiner le jeu sur canvas");
    }

    boardCanvas.width = GRID_WIDTH * CELL_SIZE;
    boardCanvas.height = GRID_HEIGHT * CELL_SIZE;
    boardContext.fillStyle = BOARD_BACKGROUND;
    boardContext.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

    state.grid.forEach((row, y) => row.forEach((cell, x) => {
        if (cell !== 0) {
            drawCell(boardContext, x, y, cell);
        }
    }));

    drawMatrix(
        boardContext,
        state.currentPiece.matrix,
        state.currentPiece.x,
        state.currentPiece.y,
        PIECE_COLORS[state.currentPiece.type]
    );

    boardContext.strokeStyle = GRID_COLOR;
    boardContext.lineWidth = 1;
    for (let x = 0; x <= GRID_WIDTH; x += 1) {
        boardContext.beginPath();
        boardContext.moveTo(x * CELL_SIZE + 0.5, 0);
        boardContext.lineTo(x * CELL_SIZE + 0.5, boardCanvas.height);
        boardContext.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y += 1) {
        boardContext.beginPath();
        boardContext.moveTo(0, y * CELL_SIZE + 0.5);
        boardContext.lineTo(boardCanvas.width, y * CELL_SIZE + 0.5);
        boardContext.stroke();
    }

    if (message) {
        boardContext.fillStyle = "rgb(0 0 0 / 70%)";
        boardContext.fillRect(0, boardCanvas.height / 2 - 30, boardCanvas.width, 60);
        boardContext.fillStyle = "#ffffff";
        boardContext.font = "bold 20px system-ui, sans-serif";
        boardContext.textAlign = "center";
        boardContext.textBaseline = "middle";
        boardContext.fillText(message, boardCanvas.width / 2, boardCanvas.height / 2);
    }

    nextCanvas.width = 120;
    nextCanvas.height = 120;
    nextContext.fillStyle = BOARD_BACKGROUND;
    nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    const nextMatrix = PIECES[state.nextPiece];
    const previewCellSize = 24;
    const offsetX = Math.floor((nextCanvas.width - nextMatrix[0].length * previewCellSize) / 2);
    const offsetY = Math.floor((nextCanvas.height - nextMatrix.length * previewCellSize) / 2);
    nextMatrix.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
        if (cell === 1) {
            nextContext.fillStyle = PIECE_COLORS[state.nextPiece];
            nextContext.fillRect(
                offsetX + columnIndex * previewCellSize + 1,
                offsetY + rowIndex * previewCellSize + 1,
                previewCellSize - 2,
                previewCellSize - 2
            );
        }
    }));

    if (state.lastClearedLines > 0 && state !== lastAnimatedState) {
        lastAnimatedState = state;
        const view = boardCanvas.ownerDocument?.defaultView;
        const prefersReducedMotion = view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReducedMotion && typeof boardCanvas.animate === "function") {
            boardCanvas.animate(
                [
                    { filter: "brightness(1)" },
                    { filter: "brightness(2)" },
                    { filter: "brightness(1)" }
                ],
                { duration: 300, easing: "ease-out" }
            );
        }
    }
};
