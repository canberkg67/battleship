import { Player } from '../src/Player.js';

describe('Player', () => {
    test("Player can be created", () => {
        const player = new Player();
        expect(player).toBeDefined();
    });
    test("Player has a gameboard", () => {
        const player = new Player();
        expect(player.gameboard).toBeDefined();
    });
    test("Player can attack enemy gameboard and miss", () => {
        const player = new Player();
        const enemy = new Player();

        player.attack(enemy.gameboard, [0, 0]);
        expect(enemy.gameboard.missedAttacks).toContainEqual([0, 0]);
    });
});