import { createGame, movePiece, rotateCurrentPiece } from "./game.js";

export class GameInstance {
    constructor({ name = "Joueur 1", rng, seed } = {}) {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new Error("Le pseudo du joueur ne peut pas être vide");
        }

        this.name = name.trim();
        this.state = createGame({ rng, seed });
        this.elapsedSinceDrop = 0;
    }

    get isAlive() {
        return this.state.status === "playing";
    }

    get grid() {
        return this.state.grid;
    }

    get currentPiece() {
        return this.state.currentPiece;
    }

    get nextPiece() {
        return this.state.nextPiece;
    }

    get score() {
        return this.state.score;
    }

    get level() {
        return this.state.level;
    }

    move(dx, dy) {
        if (!this.isAlive) {
            return this.state;
        }

        this.state = movePiece(this.state, dx, dy);
        return this.state;
    }

    rotate() {
        if (!this.isAlive) {
            return this.state;
        }

        this.state = rotateCurrentPiece(this.state);
        return this.state;
    }

    update(elapsedMs) {
        if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
            throw new Error("Le temps écoulé doit être un nombre positif ou nul");
        }
        if (!this.isAlive) {
            return this.state;
        }

        this.elapsedSinceDrop += elapsedMs;
        while (this.isAlive && this.elapsedSinceDrop >= this.state.dropInterval) {
            this.elapsedSinceDrop -= this.state.dropInterval;
            this.state = movePiece(this.state, 0, 1);
        }
        return this.state;
    }
}
