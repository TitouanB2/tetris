import { createGame, movePiece, rotateCurrentPiece } from "./game.js";

/**
 * Encapsule l'état et les commandes d'une partie autonome.
 */
export class GameInstance {
    /**
     * Initialise une partie avec un pseudo et une source d'aléatoire optionnelle.
     * @param {{name?: string, rng?: () => number, seed?: number}} [options] Configuration de la partie.
     * @throws {Error} Si le pseudo ou la configuration aléatoire est invalide.
     */
    constructor({ name = "Joueur 1", rng, seed } = {}) {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new Error("Le pseudo du joueur ne peut pas être vide");
        }

        this.name = name.trim();
        this.state = createGame({ rng, seed });
        this.elapsedSinceDrop = 0;
    }

    /** @returns {boolean} Vrai tant que la partie n'est pas terminée. */
    get isAlive() {
        return this.state.status === "playing";
    }

    /** @returns {Array<Array<number|string>>} Grille actuelle. */
    get grid() {
        return this.state.grid;
    }

    /** @returns {object} Pièce actuellement contrôlée. */
    get currentPiece() {
        return this.state.currentPiece;
    }

    /** @returns {string} Type de la prochaine pièce. */
    get nextPiece() {
        return this.state.nextPiece;
    }

    /** @returns {number} Score courant. */
    get score() {
        return this.state.score;
    }

    /** @returns {number} Niveau courant. */
    get level() {
        return this.state.level;
    }

    /**
     * Déplace la pièce courante d'une case.
     * @param {number} dx Déplacement horizontal, -1 ou 1.
     * @param {number} dy Déplacement vertical, -1 ou 1.
     * @returns {object} Nouvel état de partie.
     * @throws {Error} Si le déplacement n'est pas d'une seule case horizontale ou verticale.
     */
    move(dx, dy) {
        if (!this.isAlive) {
            return this.state;
        }

        this.state = movePiece(this.state, dx, dy);
        return this.state;
    }

    /**
     * Tente de tourner la pièce courante.
     * @returns {object} Nouvel état de partie.
     * @throws {Error} Si la matrice de la pièce courante ne peut pas être tournée.
     */
    rotate() {
        if (!this.isAlive) {
            return this.state;
        }

        this.state = rotateCurrentPiece(this.state);
        return this.state;
    }

    /**
     * Avance les horloges de chute de la partie.
     * @param {number} elapsedMs Temps écoulé en millisecondes.
     * @returns {object} Nouvel état de partie.
     * @throws {Error} Si le temps écoulé n'est pas un nombre fini positif ou nul.
     */
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
