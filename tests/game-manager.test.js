import { describe, expect, it, vi } from "vitest";
import { GameManager } from "../src/core/game-manager.js";

describe("GameManager", () => {
    it.each([1, 2, 3, 4])("crée %i partie(s) avec des pseudos par défaut", (playerCount) => {
        const manager = new GameManager({ playerCount, seed: 10 });

        expect(manager.instances).toHaveLength(playerCount);
        expect(manager.instances.map((instance) => instance.name)).toEqual(
            Array.from({ length: playerCount }, (_, index) => `Joueur ${index + 1}`)
        );
        expect(manager.status).toBe("playing");
    });

    it("valide le nombre de joueurs, les noms et la graine", () => {
        expect(() => new GameManager({ playerCount: 0 })).toThrow("compris entre 1 et 4");
        expect(() => new GameManager({ playerCount: 5 })).toThrow("compris entre 1 et 4");
        expect(() => new GameManager({ playerCount: 2, names: ["Ada"] })).toThrow("un pseudo par joueur");
        expect(() => new GameManager({ seed: 1.5 })).toThrow("La graine doit être un entier");
        expect(() => new GameManager({ rngFactory: true })).toThrow("fabrique de générateurs");
        expect(() => new GameManager({ seed: 1, rngFactory: () => () => 0 })).toThrow("pas les deux");
    });

    it("accepte des noms et des générateurs propres à chaque joueur", () => {
        const manager = new GameManager({
            playerCount: 2,
            names: ["Ada", "Lin"],
            rngFactory: (index) => () => index / 7
        });

        expect(manager.instances.map((instance) => instance.name)).toEqual(["Ada", "Lin"]);
        expect(manager.instances.map((instance) => instance.currentPiece.type)).toEqual(["I", "O"]);
    });

    it("reproduit les parties IA lorsque la même graine est réutilisée", () => {
        const runMatch = () => {
            const manager = new GameManager({
                playerCount: 2,
                aiLevels: ["beginner"],
                seed: 41
            });
            for (let tick = 0; tick < 50; tick += 1) {
                manager.update(50);
            }
            return manager.instances.map((instance) => ({
                grid: instance.grid,
                pieceType: instance.currentPiece.type,
                pieceX: instance.currentPiece.x,
                pieceY: instance.currentPiece.y,
                alive: instance.isAlive,
                score: instance.score
            }));
        };

        expect(runMatch()).toEqual(runMatch());
    });

    it("associe un adversaire IA à chaque joueur VS et les fait jouer", () => {
        const manager = new GameManager({
            playerCount: 4,
            aiLevels: ["beginner", "intermediate", "expert"],
            seed: 10
        });
        const movePlayer = vi.spyOn(manager, "movePlayer");
        const rotatePlayer = vi.spyOn(manager, "rotatePlayer");
        const initialStates = manager.instances.slice(1).map((instance) => instance.state);

        expect(manager.instances.map((instance) => instance.name)).toEqual([
            "Joueur 1",
            "IA 1",
            "IA 2",
            "IA 3"
        ]);
        expect([...manager.aiPlayers.values()].map((ai) => ai.level)).toEqual([
            "beginner",
            "intermediate",
            "expert"
        ]);

        manager.update(300);

        expect(manager.instances.slice(1).every((instance, index) => (
            instance.state !== initialStates[index]
        ))).toBe(true);
        expect(movePlayer.mock.calls.length + rotatePlayer.mock.calls.length).toBeGreaterThan(0);
    });

    it("valide la configuration des niveaux IA", () => {
        expect(() => new GameManager({
            playerCount: 3,
            aiLevels: ["beginner"]
        })).toThrow("un niveau d'IA valide par adversaire");
        expect(() => new GameManager({
            playerCount: 2,
            aiLevels: ["impossible"]
        })).toThrow("un niveau d'IA valide par adversaire");
    });

    it("expose les joueurs et rejette un index inconnu", () => {
        const manager = new GameManager({ playerCount: 2, seed: 2 });

        expect(manager.getInstance(0)).toBe(manager.instances[0]);
        expect(() => manager.getInstance(2)).toThrow("Joueur inconnu");
        expect(() => manager.getInstance(1.5)).toThrow("Joueur inconnu");
    });

    it("fait avancer toutes les parties simultanément", () => {
        const manager = new GameManager({ playerCount: 3, seed: 10 });
        const initialPositions = manager.instances.map((instance) => instance.currentPiece.y);

        manager.update(1000);

        expect(manager.instances.map((instance) => instance.currentPiece.y)).toEqual(
            initialPositions.map((y) => y + 1)
        );
    });

    it("aiguille les déplacements et les rotations vers la bonne instance", () => {
        const manager = new GameManager({
            playerCount: 2,
            rngFactory: (index) => () => index === 0 ? 0.3 : 0.5
        });
        const firstX = manager.instances[0].currentPiece.x;
        const secondX = manager.instances[1].currentPiece.x;
        const firstMatrix = manager.instances[0].currentPiece.matrix;

        manager.movePlayer(1, 1, 0);
        manager.rotatePlayer(0);

        expect(manager.instances[0].currentPiece.x).toBe(firstX);
        expect(manager.instances[1].currentPiece.x).toBe(secondX + 1);
        expect(manager.instances[0].currentPiece.matrix).not.toEqual(firstMatrix);
    });

    it("déclare le dernier survivant gagnant et classe le reste par score", () => {
        const manager = new GameManager({ playerCount: 4, seed: 3 });
        manager.instances[0].state = { ...manager.instances[0].state, score: 200, status: "gameOver" };
        manager.instances[1].state = { ...manager.instances[1].state, score: 500, status: "gameOver" };
        manager.instances[2].state = { ...manager.instances[2].state, score: 300, status: "gameOver" };

        manager.update(0);

        expect(manager.status).toBe("finished");
        expect(manager.winner.name).toBe("Joueur 4");
        expect(manager.podium.map((instance) => instance.name)).toEqual([
            "Joueur 4",
            "Joueur 2",
            "Joueur 3",
            "Joueur 1"
        ]);
    });

    it("termine immédiatement une partie VS quand le dernier adversaire est éliminé", () => {
        const manager = new GameManager({ playerCount: 2, seed: 3 });
        const survivor = manager.instances[1];
        manager.instances[0].state = { ...manager.instances[0].state, status: "gameOver" };

        manager.movePlayer(1, 1, 0);

        expect(manager.status).toBe("finished");
        expect(manager.winner).toBe(survivor);
    });

    it("termine une partie solo sans déclarer de gagnant", () => {
        const manager = new GameManager({ playerCount: 1, seed: 4 });
        manager.instances[0].state = { ...manager.instances[0].state, status: "gameOver" };

        manager.update(0);

        expect(manager.status).toBe("finished");
        expect(manager.winner).toBeNull();
        expect(manager.podium).toHaveLength(1);
    });

    it("valide le temps écoulé et ignore les commandes après la fin", () => {
        const manager = new GameManager({ playerCount: 1, seed: 4 });
        manager.instances[0].state = { ...manager.instances[0].state, status: "gameOver" };
        manager.update(0);

        expect(() => manager.update(-1)).toThrow("positif ou nul");
        expect(manager.movePlayer(0, 0, 1).status).toBe("gameOver");
        expect(manager.rotatePlayer(0).status).toBe("gameOver");
        expect(manager.update(10)).toBe(manager);
    });

    it("ne termine pas une session multijoueur tant que deux joueurs sont en vie", () => {
        const manager = new GameManager({ playerCount: 3, seed: 9 });
        manager.instances[0].state = { ...manager.instances[0].state, status: "gameOver" };

        manager.update(0);

        expect(manager.status).toBe("playing");
        expect(manager.winner).toBeNull();
        expect(manager.podium).toEqual([]);
    });

    it("continue le VS jusqu'à ce qu'il ne reste qu'un joueur vivant puis affiche le podium", () => {
        const manager = new GameManager({
            playerCount: 4,
            aiLevels: ["beginner", "intermediate", "expert"],
            seed: 21
        });
        manager.instances[0].state = {
            ...manager.instances[0].state,
            status: "gameOver",
            score: 100
        };

        manager.update(0);
        expect(manager.status).toBe("playing");
        expect(manager.podium).toEqual([]);

        manager.instances[1].state = {
            ...manager.instances[1].state,
            status: "gameOver",
            score: 200
        };
        manager.instances[2].state = {
            ...manager.instances[2].state,
            status: "gameOver",
            score: 300
        };
        manager.instances[3].state = {
            ...manager.instances[3].state,
            score: 400
        };
        manager.update(0);

        expect(manager.status).toBe("finished");
        expect(manager.winner.name).toBe("IA 3");
        expect(manager.podium.map((instance) => instance.name)).toEqual([
            "IA 3",
            "IA 2",
            "IA 1",
            "Joueur 1"
        ]);
    });

    it("utilise l'ordre des joueurs pour départager les scores identiques", () => {
        const manager = new GameManager({ playerCount: 2, seed: 5 });
        manager.instances.forEach((instance) => {
            instance.state = { ...instance.state, status: "gameOver", score: 0 };
        });

        manager.update(0);

        expect(manager.podium.map((instance) => instance.name)).toEqual(["Joueur 1", "Joueur 2"]);
    });
});
