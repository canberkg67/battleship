import { Game } from '../src/Game.js';

describe('Game', () => {
    test("Game can be created", () => {
        const game = new Game();
        expect(game).toBeDefined();
    });
    test("Game has two players", () => {
        const game = new Game();
        expect(game.player1).toBeDefined();
        expect(game.player2).toBeDefined();
    });
});
