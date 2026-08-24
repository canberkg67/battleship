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
});