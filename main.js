import { GameManager } from "./src/core/game-manager.js";
import { setupInput } from "./src/ui/input.js";
import { renderGame } from "./src/ui/renderer.js";

const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Élément HTML introuvable : #${id}`);
    }
    return element;
};

const modeSelection = getElement("mode-selection");
const aiDifficulty = getElement("ai-difficulty");
const gameView = getElement("game-view");
const playersElement = getElement("players");
const statusElement = getElement("game-status");
const podiumElement = getElement("podium");
const podiumTitle = getElement("podium-title");
const podiumList = getElement("podium-list");
const startButton = getElement("start");
const pauseButton = getElement("pause");
const restartButton = getElement("restart");
const changeModeButton = getElement("change-mode");

const PLAYER_CONTROLS = [
    "← → déplacer · ↑ tourner · ↓ descendre",
    "A D déplacer · W tourner · S descendre",
    "F H déplacer · T tourner · G descendre",
    "J L déplacer · I tourner · K descendre"
];

let manager = null;
let playerCards = [];
let isPaused = false;
let isStarted = false;
let timer = null;

const createPlayerCard = (instance, index) => {
    const card = document.createElement("article");
    card.className = "player-card";
    card.dataset.playerIndex = String(index);

    const title = document.createElement("h2");
    title.className = "player-card__name";
    title.textContent = instance.name;

    const aiPlayer = manager.aiPlayers.get(index);
    const playerType = document.createElement("p");
    playerType.className = "player-card__help";
    playerType.textContent = aiPlayer
        ? `IA · ${aiPlayer.label}`
        : index === 0 ? PLAYER_CONTROLS[0] : PLAYER_CONTROLS[index];

    const content = document.createElement("div");
    content.className = "player-card__content";

    const board = document.createElement("canvas");
    board.className = "player-card__board";
    board.width = 300;
    board.height = 600;
    board.setAttribute("aria-label", `Grille de ${instance.name}`);

    const sidebar = document.createElement("div");
    sidebar.className = "player-card__sidebar";

    const previewTitle = document.createElement("h3");
    previewTitle.className = "player-card__section-title";
    previewTitle.textContent = "Pièce suivante";

    const preview = document.createElement("canvas");
    preview.className = "player-card__preview";
    preview.width = 120;
    preview.height = 120;
    preview.setAttribute("aria-label", `Prochaine pièce de ${instance.name}`);

    const stats = document.createElement("dl");
    stats.className = "player-card__stats";
    const score = document.createElement("div");
    const scoreLabel = document.createElement("dt");
    scoreLabel.textContent = "Score";
    const scoreValue = document.createElement("dd");
    scoreValue.textContent = "0";
    score.append(scoreLabel, scoreValue);

    const level = document.createElement("div");
    const levelLabel = document.createElement("dt");
    levelLabel.textContent = "Niveau";
    const levelValue = document.createElement("dd");
    levelValue.textContent = "1";
    level.append(levelLabel, levelValue);
    stats.append(score, level);

    const playerStatus = document.createElement("p");
    playerStatus.className = "player-card__status";
    playerStatus.setAttribute("aria-live", "polite");

    sidebar.append(previewTitle, preview, stats, playerStatus);
    content.append(board, sidebar);
    card.append(title, playerType, content);
    playersElement.append(card);

    return { card, board, preview, score: scoreValue, level: levelValue, status: playerStatus };
};

const buildPodium = () => {
    podiumList.replaceChildren();
    const podium = manager.podium;
    podiumTitle.textContent = manager.winner
        ? `Gagnant : ${manager.winner.name}`
        : "Partie terminée";

    podium.forEach((instance, index) => {
        const row = document.createElement("li");
        row.textContent = `${instance.name} — ${instance.score} points`;
        if (instance === manager.winner) {
            row.classList.add("podium__winner");
        }
        row.value = index + 1;
        podiumList.append(row);
    });
    podiumElement.hidden = false;
};

const render = () => {
    if (!manager) {
        return;
    }

    manager.instances.forEach((instance, index) => {
        const card = playerCards[index];
        const message = manager.status === "finished" && instance === manager.winner
            ? "Gagnant"
            : !instance.isAlive
                ? "Éliminé"
                : isPaused
                    ? "En pause"
                    : !isStarted ? "Prêt" : "";

        renderGame({
            boardCanvas: card.board,
            nextCanvas: card.preview,
            state: instance.state,
            message
        });
        card.score.textContent = String(instance.score);
        card.level.textContent = String(instance.level);
        card.status.textContent = message;
        card.card.classList.toggle("player-card--eliminated", !instance.isAlive);
        card.card.classList.toggle("player-card--winner", manager.status === "finished"
            && instance === manager.winner);
    });

    statusElement.textContent = manager.status === "finished"
        ? "La partie est terminée."
        : isPaused
            ? "Partie en pause."
            : isStarted ? "Partie en cours." : "Prêt à jouer.";
    startButton.textContent = isPaused ? "Reprendre" : "Démarrer";
    startButton.disabled = isStarted && !isPaused || manager.status === "finished";
    pauseButton.disabled = !isStarted || isPaused || manager.status === "finished";
    podiumElement.hidden = manager.status !== "finished";
    if (manager.status === "finished") {
        buildPodium();
    }
};

const stopTimer = () => {
    if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
    }
};

const createManager = (playerCount) => {
    stopTimer();
    const aiLevels = Array.from(
        { length: playerCount - 1 },
        () => aiDifficulty.value
    );
    manager = new GameManager({ playerCount, aiLevels });
    playersElement.replaceChildren();
    playerCards = manager.instances.map(createPlayerCard);
    playersElement.dataset.count = String(playerCount);
    isPaused = false;
    isStarted = false;
    podiumElement.hidden = true;
    gameStatusReset();
    modeSelection.hidden = true;
    gameView.hidden = false;
    render();
};

const gameStatusReset = () => {
    statusElement.textContent = "";
    podiumList.replaceChildren();
};

const startTimer = () => {
    if (timer === null) {
        timer = window.setInterval(() => {
            if (isStarted && !isPaused && manager.status === "playing") {
                manager.update(50);
                if (manager.status === "finished") {
                    stopTimer();
                }
                render();
            }
        }, 50);
    }
};

const startGame = () => {
    if (manager.status === "finished") {
        createManager(manager.playerCount);
    }
    isPaused = false;
    isStarted = true;
    startTimer();
    render();
};

const togglePause = () => {
    if (!isStarted || manager.status === "finished") {
        return;
    }
    isPaused = !isPaused;
    render();
};

const restartGame = () => {
    createManager(manager.playerCount);
    startGame();
};

const move = (playerIndex, dx, dy) => {
    if (!isStarted || isPaused || manager.status !== "playing" || playerIndex >= manager.playerCount) {
        return;
    }
    manager.movePlayer(playerIndex, dx, dy);
    if (manager.status === "finished") {
        stopTimer();
    }
    render();
};

const rotate = (playerIndex) => {
    if (!isStarted || isPaused || manager.status !== "playing" || playerIndex >= manager.playerCount) {
        return;
    }
    manager.rotatePlayer(playerIndex);
    render();
};

document.querySelectorAll("[data-player-count]").forEach((button) => {
    button.addEventListener("click", () => createManager(Number(button.dataset.playerCount)));
});
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartGame);
changeModeButton.addEventListener("click", () => {
    stopTimer();
    manager = null;
    playerCards = [];
    playersElement.replaceChildren();
    gameView.hidden = true;
    modeSelection.hidden = false;
});

setupInput({
    playerCount: 1,
    onMove: move,
    onRotate: rotate,
    onTogglePause: togglePause
});
