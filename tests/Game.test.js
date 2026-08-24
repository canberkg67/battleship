import { Game } from '../src/Game.js';

describe('Game', () => {
    test("Game can be created", () => {
        const game = new Game();
        expect(game).toBeDefined();
    });
});
