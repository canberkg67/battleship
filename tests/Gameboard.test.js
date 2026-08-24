import { Gameboard } from '../src/Gameboard.js';
import { Ship } from '../src/Ship.js';

describe('Gameboard', () => {
    test("Gameboard can be created", () => {
        const gameboard = new Gameboard();
        expect(gameboard).toBeDefined();
    });
    test("Starts with no ship", () => {
        const gameboard = new Gameboard();
        expect(gameboard.ships).toEqual([]);
    })
    test("Can add a ship to the gameboard", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);
        gameboard.placeShip(ship,[0,0], 'horizontal');
        expect(gameboard.ships).toContain(ship);
    });
    test("Places a ship horizontally on the gameboard", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);
        
        gameboard.placeShip(ship, [0, 0], 'horizontal');
        
        expect(gameboard.board[0][0]).toBe(ship);
        expect(gameboard.board[0][1]).toBe(ship);
        expect(gameboard.board[0][2]).toBe(ship);
    });
    test("Places a ship vertically on the gameboard", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);

        gameboard.placeShip(ship, [0, 0], 'vertical');
        
        expect(gameboard.board[0][0]).toBe(ship);
        expect(gameboard.board[1][0]).toBe(ship);
        expect(gameboard.board[2][0]).toBe(ship);
    });
});