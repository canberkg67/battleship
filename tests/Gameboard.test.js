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
});