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
});