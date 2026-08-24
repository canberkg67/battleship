import { Ship } from './Ship.js';

export class Gameboard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
    }

    placeShip(ship, coordinates, orientation) {
        // we won't implement the full placement logic here yet.
        this.ships.push(ship);
    }
}