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
    test("automatically switch player after a missed attack", () => {
        const game = new Game();
        const ship = new Ship(1);
        game.player2.gameboard.placeShip(ship, [0, 0], 'horizontal');
        game.playTurn([1, 1]);
        expect(game.currentPlayer).toBe(game.player2);
    });
    test("does not switch player after a successful attack", () => {
        const game = new Game();
        const ship = new Ship(1);
        game.player2.gameboard.placeShip(ship, [0, 0], 'horizontal');
        game.playTurn([0, 0]);
        expect(game.currentPlayer).toBe(game.player1);
    });
    test("createShips method returns an array of ships", () => {
        const game = new Game();
        const ships = game.createShips();
        expect(ships.length).toBe(5);
        expect(ships[0].name).toBe("Carrier");
        expect(ships[1].name).toBe("Battleship");
        expect(ships[2].name).toBe("Cruiser");
        expect(ships[3].name).toBe("Submarine");
        expect(ships[4].name).toBe("Destroyer");
    });
    test("Players start with available ships", () => {
        const game = new Game();
        expect(game.player1.availableShips.length).toBe(5);
        expect(game.player2.availableShips.length).toBe(5);
    });
});
