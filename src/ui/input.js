const PLAYER_BINDINGS = [
    {
        left: "ArrowLeft",
        right: "ArrowRight",
        down: "ArrowDown",
        rotate: "ArrowUp"
    },
    {
        left: "a",
        right: "d",
        down: "s",
        rotate: "w"
    },
    {
        left: "f",
        right: "h",
        down: "g",
        rotate: "t"
    },
    {
        left: "j",
        right: "l",
        down: "k",
        rotate: "i"
    }
];

export const setupInput = ({
    target = window,
    playerCount = 1,
    onMove,
    onRotate,
    onTogglePause
}) => {
    if (!target || typeof target.addEventListener !== "function") {
        throw new Error("La cible des commandes clavier doit gérer les événements");
    }
    if (!Number.isInteger(playerCount) || playerCount < 1 || playerCount > PLAYER_BINDINGS.length) {
        throw new Error("Le nombre de joueurs doit être compris entre 1 et 4");
    }
    if (typeof onMove !== "function" || typeof onRotate !== "function" || typeof onTogglePause !== "function") {
        throw new Error("Chaque commande clavier doit avoir une fonction de rappel");
    }

    const handleKeyDown = (event) => {
        if (event.target?.matches?.("input, textarea, select, [contenteditable=true]")) {
            return;
        }

        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (key === "p") {
            if (!event.repeat) {
                onTogglePause();
            }
            return;
        }

        for (let playerIndex = 0; playerIndex < playerCount; playerIndex += 1) {
            const bindings = PLAYER_BINDINGS[playerIndex];
            const move = {
                [bindings.left]: [-1, 0],
                [bindings.right]: [1, 0],
                [bindings.down]: [0, 1]
            }[key];

            if (move) {
                event.preventDefault();
                onMove(playerIndex, ...move);
                return;
            }
            if (key === bindings.rotate) {
                event.preventDefault();
                onRotate(playerIndex);
                return;
            }
        }
    };

    target.addEventListener("keydown", handleKeyDown);
    return () => target.removeEventListener("keydown", handleKeyDown);
};
