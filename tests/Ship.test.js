import { Ship } from '../src/Ship.js';

describe('Ship', () => {
    test("Has a length", () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });
});