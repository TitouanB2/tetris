import { AI_LEVELS, AIPlayer } from "../src/core/ai.js";
import { createSeededRng } from "../src/core/game.js";
import { GameInstance } from "../src/core/game-instance.js";

const GAME_COUNT = 20;
const BASE_SEED = 20261118;
const FRAME_DURATION_MS = 100;
const MAX_GAME_DURATION_MS = 20000000;
const AI_SEED_OFFSET = 100000;
const LEVEL_LABELS = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    expert: "Expert"
};

const simulateGame = (level, gameNumber) => {
    const seed = BASE_SEED + gameNumber;
    const instance = new GameInstance({ seed });
    const ai = new AIPlayer({
        level,
        rng: createSeededRng(seed + AI_SEED_OFFSET)
    });

    for (let elapsedMs = 0; instance.isAlive; elapsedMs += FRAME_DURATION_MS) {
        if (elapsedMs >= MAX_GAME_DURATION_MS) {
            throw new Error(`La partie ${gameNumber + 1} (${level}) a dépassé la durée maximale de simulation`);
        }
        instance.update(FRAME_DURATION_MS);
        ai.update(instance, FRAME_DURATION_MS);
    }

    return instance.state.lines;
};

const results = AI_LEVELS.map((level) => {
    const totalLines = Array.from({ length: GAME_COUNT }, (_, index) => (
        simulateGame(level, index)
    )).reduce((total, lines) => total + lines, 0);

    return {
        level,
        averageLines: totalLines / GAME_COUNT
    };
});

for (const { level, averageLines } of results) {
    console.log(`${LEVEL_LABELS[level]} : ${averageLines.toFixed(2)} lignes en moyenne sur ${GAME_COUNT} parties`);
}

const beginnerAverage = results.find(({ level }) => level === "beginner").averageLines;
const expertAverage = results.find(({ level }) => level === "expert").averageLines;
if (expertAverage <= beginnerAverage) {
    throw new Error("L'IA experte doit compléter plus de lignes en moyenne que l'IA débutante");
}
