import { Ship } from '../src/Ship.js';

describe('Ship', () => {
    test("Has a length", () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });
    test("Hit increase the hit count", () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    });
});