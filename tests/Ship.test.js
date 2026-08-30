import { Ship } from '../src/Ship.js';

describe('Ship', () => {
    test("Has a length", () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });
    test("Ships have a name", () => {
        const ship = new Ship(3 , "Submarine");
        expect(ship.name).toBe("Submarine");
    });
    test("Hit increase the hit count", () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    });
    test("Ship is sunk when hits equal length", () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});