const LINE_SCORES = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;
const INITIAL_DROP_INTERVAL = 1000;
const DROP_INTERVAL_STEP = 100;
const MINIMUM_DROP_INTERVAL = 100;

export const calculateLineScore = (clearedLines) => {
    if (!Number.isInteger(clearedLines) || clearedLines < 0 || clearedLines >= LINE_SCORES.length) {
        throw new Error("Le nombre de lignes supprimées doit être un entier de 0 à 4");
    }

    return LINE_SCORES[clearedLines];
};

export const calculateLevel = (totalLines) => {
    if (!Number.isSafeInteger(totalLines) || totalLines < 0) {
        throw new Error("Le nombre total de lignes doit être un entier positif ou nul");
    }

    return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
};

export const getDropInterval = (level) => {
    if (!Number.isSafeInteger(level) || level < 1) {
        throw new Error("Le niveau doit être un entier positif");
    }

    return Math.max(
        INITIAL_DROP_INTERVAL - (level - 1) * DROP_INTERVAL_STEP,
        MINIMUM_DROP_INTERVAL
    );
};
