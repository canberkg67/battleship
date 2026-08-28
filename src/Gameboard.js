import { Ship } from './Ship.js';

export class Gameboard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    }

    placeShip(ship, coordinates, orientation) {

        //coordinates are starting point
        const [x, y] = coordinates; // x is the row index, y is the column index

        // Check if the ship placement is out of bounds
        if ( (orientation === 'horizontal' && y + ship.length > 10) || 
            (orientation === 'vertical' && x + ship.length > 10) ) {
            throw new Error("Ship placement is out of bounds");
        }

        // Check if the ship placement overlaps with another ship
        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal' && this.board[x][y + i] !== null) {
                throw new Error("Ship placement overlaps with another ship");
            } else if (orientation === 'vertical' && this.board[x + i][y] !== null) {
                throw new Error("Ship placement overlaps with another ship");
            }
        }

        if (orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                this.board[x][y + i] = ship; // same row but columns incremented by i
            }
        } else if (orientation === 'vertical') {
            for (let i = 0; i < ship.length; i++) {
                this.board[x + i][y] = ship; // same column but rows incremented by i
            }
        }
        
        this.ships.push(ship);
    }

    receiveAttack(coordinates) {
        const [x, y] = coordinates;
        const target = this.board[x][y];
        if (target) {
            target.hit();
        } else {
            this.missedAttacks.push(coordinates);
        }
    }

    allShipsSunk() {
        return this.ships.length > 0 && this.ships.every(ship => ship.isSunk());
    }
}