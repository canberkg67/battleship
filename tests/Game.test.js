import { Game } from '../src/Game.js';
import { Ship } from '../src/Ship.js';

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
        const ship = new Ship(1);
        game.player2.gameboard.placeShip(ship, [0, 0], 'horizontal');
        game.player1.attack(game.player2.gameboard, [0, 0]);
        expect(game.isGameOver()).toBe(true);
    });
    test("Return the winner if one player has no ships left", () => {
        const game = new Game();
        const ship = new Ship(1);
        game.player2.gameboard.placeShip(ship, [0, 0], 'horizontal');
        game.player1.attack(game.player2.gameboard, [0, 0]);
        expect(game.getWinner()).toBe(game.player1);
    });
});
