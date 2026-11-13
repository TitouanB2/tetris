export const setupInput = ({
    target = window,
    onMove,
    onRotate,
    onTogglePause
}) => {
    if (!target || typeof target.addEventListener !== "function") {
        throw new Error("La cible des commandes clavier doit gérer les événements");
    }

    const handleKeyDown = (event) => {
        if (event.target?.matches?.("input, textarea, select, [contenteditable=true]")) {
            return;
        }

        switch (event.key) {
            case "ArrowLeft":
                event.preventDefault();
                onMove(-1, 0);
                break;
            case "ArrowRight":
                event.preventDefault();
                onMove(1, 0);
                break;
            case "ArrowDown":
                event.preventDefault();
                onMove(0, 1);
                break;
            case "ArrowUp":
                event.preventDefault();
                onRotate();
                break;
            case "p":
            case "P":
                if (!event.repeat) {
                    onTogglePause();
                }
                break;
        }
    };

    target.addEventListener("keydown", handleKeyDown);
    return () => target.removeEventListener("keydown", handleKeyDown);
};
