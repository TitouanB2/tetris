import { createGame, movePiece, rotateCurrentPiece } from "./src/core/game.js";
import { setupInput } from "./src/ui/input.js";
import { renderGame } from "./src/ui/renderer.js";

const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Élément HTML introuvable : #${id}`);
    }
    return element;
};

const boardCanvas = getElement("board");
const nextCanvas = getElement("next-piece");
const statusElement = getElement("game-status");
const finalScoreElement = getElement("final-score");
const scoreElement = getElement("score");
const levelElement = getElement("level");
const linesElement = getElement("lines");
const startButton = getElement("start");
const pauseButton = getElement("pause");
const restartButton = getElement("restart");

let state = createGame();
let hasStarted = false;
let isPaused = false;
let timer = null;

const getMessage = () => {
    if (state.status === "gameOver") {
        return "Partie terminée";
    }
    if (isPaused) {
        return "En pause";
    }
    return hasStarted ? "" : "Prêt";
};

const render = () => {
    const message = getMessage();
    renderGame({ boardCanvas, nextCanvas, state, message });
    statusElement.textContent = message;
    finalScoreElement.hidden = state.status !== "gameOver";
    finalScoreElement.textContent = state.status === "gameOver"
        ? `Score final : ${state.score}`
        : "";
    scoreElement.textContent = String(state.score);
    levelElement.textContent = String(state.level);
    linesElement.textContent = String(state.lines);
    startButton.textContent = state.status === "gameOver"
        ? "Nouvelle partie"
        : isPaused ? "Reprendre" : "Démarrer";
    startButton.disabled = hasStarted && !isPaused && state.status === "playing";
    pauseButton.textContent = "Pause";
    pauseButton.disabled = !hasStarted || isPaused || state.status === "gameOver";
};

const stopTimer = () => {
    if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
    }
};

const startTimer = () => {
    if (timer === null) {
        timer = window.setInterval(() => {
            if (!isPaused && state.status === "playing") {
                const previousDropInterval = state.dropInterval;
                state = movePiece(state, 0, 1);
                if (state.status === "gameOver") {
                    stopTimer();
                } else if (state.dropInterval !== previousDropInterval) {
                    stopTimer();
                    startTimer();
                }
                render();
            }
        }, state.dropInterval);
    }
};

const startGame = () => {
    if (state.status === "gameOver") {
        state = createGame();
    }
    hasStarted = true;
    isPaused = false;
    startTimer();
    render();
};

const togglePause = () => {
    if (!hasStarted || state.status === "gameOver") {
        return;
    }
    isPaused = !isPaused;
    render();
};

const restartGame = () => {
    stopTimer();
    state = createGame();
    hasStarted = true;
    isPaused = false;
    startTimer();
    render();
};

const move = (dx, dy) => {
    if (!hasStarted || isPaused || state.status !== "playing") {
        return;
    }
    state = movePiece(state, dx, dy);
    if (state.status === "gameOver") {
        stopTimer();
    }
    render();
};

const rotate = () => {
    if (!hasStarted || isPaused || state.status !== "playing") {
        return;
    }
    state = rotateCurrentPiece(state);
    render();
};

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartGame);
setupInput({
    onMove: move,
    onRotate: rotate,
    onTogglePause: togglePause
});

render();
