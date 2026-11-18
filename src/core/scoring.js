const LINE_SCORES = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;
const INITIAL_DROP_INTERVAL = 1000;
const DROP_INTERVAL_STEP = 100;
const MINIMUM_DROP_INTERVAL = 100;

/**
 * Retourne le score attribué au nombre de lignes supprimées en un coup.
 * @param {number} clearedLines Nombre de lignes supprimées, de zéro à quatre.
 * @returns {number} Points gagnés.
 * @throws {Error} Si le nombre de lignes n'est pas un entier de zéro à quatre.
 */
export const calculateLineScore = (clearedLines) => {
    if (!Number.isInteger(clearedLines) || clearedLines < 0 || clearedLines >= LINE_SCORES.length) {
        throw new Error("Le nombre de lignes supprimées doit être un entier de 0 à 4");
    }

    return LINE_SCORES[clearedLines];
};

/**
 * Calcule le niveau courant à partir du total de lignes supprimées.
 * @param {number} totalLines Nombre total de lignes supprimées.
 * @returns {number} Niveau, qui augmente toutes les dix lignes.
 * @throws {Error} Si le total n'est pas un entier sûr positif ou nul.
 */
export const calculateLevel = (totalLines) => {
    if (!Number.isSafeInteger(totalLines) || totalLines < 0) {
        throw new Error("Le nombre total de lignes doit être un entier positif ou nul");
    }

    return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
};

/**
 * Calcule l'intervalle de chute d'une pièce pour un niveau.
 * @param {number} level Niveau positif de la partie.
 * @returns {number} Intervalle en millisecondes, plafonné à 100 ms minimum.
 * @throws {Error} Si le niveau n'est pas un entier sûr positif.
 */
export const getDropInterval = (level) => {
    if (!Number.isSafeInteger(level) || level < 1) {
        throw new Error("Le niveau doit être un entier positif");
    }

    return Math.max(
        INITIAL_DROP_INTERVAL - (level - 1) * DROP_INTERVAL_STEP,
        MINIMUM_DROP_INTERVAL
    );
};
