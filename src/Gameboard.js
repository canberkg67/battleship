import { Ship } from './Ship.js';

export class Gameboard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    }

    placeShip(ship, coordinates, orientation) {

        this.ships.push(ship);
        const [x, y] = coordinates; // x is the row index, y is the column index
        if (orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                this.board[x][y + i] = ship; // same row but columns incremented by i
            }
        } else if (orientation === 'vertical') {
            for (let i = 0; i < ship.length; i++) {
                this.board[x + i][y] = ship; // same column but rows incremented by i
            }
        }
    }
}