import { Gameboard } from '../src/Gameboard.js';
import { Ship } from '../src/Ship.js';

describe('Gameboard', () => {
    test("Gameboard can be created", () => {
        const gameboard = new Gameboard();
        expect(gameboard).toBeDefined();
    });
});