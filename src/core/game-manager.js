import { createSeededRng } from "./game.js";
import { AI_LEVELS, AIPlayer } from "./ai.js";
import { GameInstance } from "./game-instance.js";

const MAX_PLAYERS = 4;

/**
 * Orchestre les parties simultanées, l'élimination et le classement final.
 */
export class GameManager {
    /**
     * Crée une à quatre parties et configure les adversaires IA éventuels.
     * @param {{playerCount?: number, names?: string[], seed?: number, rngFactory?: (index: number) => () => number, aiLevels?: string[]}} [options] Configuration des joueurs et des générateurs.
     * @throws {Error} Si le nombre de joueurs, les noms ou les sources aléatoires sont invalides.
     */
    constructor({ playerCount = 1, names, seed, rngFactory, aiLevels = [] } = {}) {
        if (!Number.isInteger(playerCount) || playerCount < 1 || playerCount > MAX_PLAYERS) {
            throw new Error(`Le nombre de joueurs doit être compris entre 1 et ${MAX_PLAYERS}`);
        }
        if (names !== undefined && (!Array.isArray(names) || names.length !== playerCount)) {
            throw new Error("Il faut fournir un pseudo par joueur");
        }
        if (seed !== undefined && !Number.isInteger(seed)) {
            throw new Error("La graine doit être un entier");
        }
        if (rngFactory !== undefined && typeof rngFactory !== "function") {
            throw new Error("La fabrique de générateurs aléatoires doit être une fonction");
        }
        if (
            !Array.isArray(aiLevels)
            || (aiLevels.length > 0 && aiLevels.length !== playerCount - 1)
            || aiLevels.some((level) => !AI_LEVELS.includes(level))
        ) {
            throw new Error("Il faut fournir un niveau d'IA valide par adversaire");
        }
        if (seed !== undefined && rngFactory !== undefined) {
            throw new Error("Fournissez une graine ou une fabrique de générateurs, pas les deux");
        }

        this.instances = Array.from({ length: playerCount }, (_, index) => {
            const aiLevel = aiLevels[index - 1];
            const name = names?.[index] ?? (aiLevel ? `IA ${index}` : `Joueur ${index + 1}`);
            const options = { name };
            if (rngFactory) {
                options.rng = rngFactory(index);
            } else if (seed !== undefined) {
                options.rng = createSeededRng(seed + index);
            }
            return new GameInstance(options);
        });
        this.aiPlayers = new Map();
        aiLevels.forEach((level, index) => {
            const instance = this.instances[index + 1];
            this.aiPlayers.set(index + 1, new AIPlayer({
                level,
                rng: instance.state.rng
            }));
        });
        this.status = "playing";
        this.winner = null;
        this.elapsedMs = 0;
        this.eliminationTimes = new Map();
        this.syncEliminations();
    }

    /** @returns {number} Nombre de parties gérées. */
    get playerCount() {
        return this.instances.length;
    }

    /** @returns {GameInstance[]} Parties qui ne sont pas terminées. */
    get activeInstances() {
        return this.instances.filter((instance) => instance.isAlive);
    }

    /** @returns {GameInstance[]} Classement complet, disponible après la fin de la partie. */
    get podium() {
        if (this.status !== "finished") {
            return [];
        }

        const winner = this.winner;
        const others = this.instances.filter((instance) => instance !== winner);
        others.sort((left, right) => (
            right.score - left.score
            || (this.eliminationTimes.get(right) ?? -1) - (this.eliminationTimes.get(left) ?? -1)
            || this.instances.indexOf(left) - this.instances.indexOf(right)
        ));
        return winner ? [winner, ...others] : others;
    }

    /**
     * Retourne une partie par son index.
     * @param {number} index Index du joueur, de zéro à playerCount - 1.
     * @returns {GameInstance} Partie correspondante.
     * @throws {Error} Si l'index ne désigne aucun joueur.
     */
    getInstance(index) {
        if (!Number.isInteger(index) || index < 0 || index >= this.instances.length) {
            throw new Error("Joueur inconnu");
        }
        return this.instances[index];
    }

    /**
     * Applique un déplacement à un joueur puis vérifie les éliminations.
     * @param {number} index Index du joueur.
     * @param {number} dx Déplacement horizontal.
     * @param {number} dy Déplacement vertical.
     * @returns {object} État de la partie ciblée.
     * @throws {Error} Si l'index ou le déplacement est invalide.
     */
    movePlayer(index, dx, dy) {
        if (this.status !== "playing") {
            return this.getInstance(index).state;
        }

        const result = this.getInstance(index).move(dx, dy);
        this.syncEliminations();
        this.checkCompletion();
        return result;
    }

    /**
     * Applique une rotation à un joueur.
     * @param {number} index Index du joueur.
     * @returns {object} État de la partie ciblée.
     * @throws {Error} Si l'index est invalide.
     */
    rotatePlayer(index) {
        if (this.status !== "playing") {
            return this.getInstance(index).state;
        }
        return this.getInstance(index).rotate();
    }

    /**
     * Avance le temps de toutes les parties et fait jouer les IA actives.
     * @param {number} elapsedMs Temps écoulé en millisecondes.
     * @returns {GameManager} Ce gestionnaire, pour permettre le chaînage.
     * @throws {Error} Si le temps écoulé n'est pas un nombre fini positif ou nul.
     */
    update(elapsedMs) {
        if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
            throw new Error("Le temps écoulé doit être un nombre positif ou nul");
        }
        if (this.status !== "playing") {
            return this;
        }

        this.elapsedMs += elapsedMs;
        for (const instance of this.activeInstances) {
            instance.update(elapsedMs);
        }
        for (const [index, aiPlayer] of this.aiPlayers) {
            const instance = this.instances[index];
            if (instance.isAlive) {
                aiPlayer.update(instance, elapsedMs, {
                    move: (dx, dy) => this.movePlayer(index, dx, dy),
                    rotate: () => this.rotatePlayer(index),
                    isActive: () => this.status === "playing"
                });
            }
        }
        this.syncEliminations();
        this.checkCompletion();
        return this;
    }

    /**
     * Termine le match lorsque le joueur solo est éliminé ou qu'il ne reste qu'un survivant en VS.
     * @returns {void}
     */
    checkCompletion() {
        if (this.status !== "playing") {
            return;
        }
        if (this.playerCount === 1 ? this.activeInstances.length === 0 : this.activeInstances.length <= 1) {
            this.winner = this.playerCount > 1 ? this.activeInstances[0] ?? null : null;
            this.status = "finished";
        }
    }

    /**
     * Enregistre l'instant d'élimination de chaque partie terminée.
     * @returns {void}
     */
    syncEliminations() {
        for (const instance of this.instances) {
            if (!instance.isAlive && !this.eliminationTimes.has(instance)) {
                this.eliminationTimes.set(instance, this.elapsedMs);
            }
        }
    }
}
