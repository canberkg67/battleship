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
    test("Player 1 starts the game", () => {
        const game = new Game();
        expect(game.currentPlayer).toBe(game.player1);
    });
    test("Game can switch players", () => {
        const game = new Game();
        game.switchPlayer();
        expect(game.currentPlayer).toBe(game.player2);
    });
    test("Game is over if one player has no ships left", () => {
        const game = new Game();
        game.player1.gameboard.ships = [];
        expect(game.isGameOver()).toBe(true);
    });
});
