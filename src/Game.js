import { Player } from '../src/Player.js';
import { Ship } from '../src/Ship.js';

export class Game {
    constructor() {
        this.player1 = new Player("YOU");
        this.player2 = new Player("ENEMY");
        this.currentPlayer = this.player1;
        this.turn = 0;
        this.player1.availableShips = this.createShips();
        this.player2.availableShips = this.createShips();
        this.placeShipsRandomly(this.player2);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        // If currentPlayer is player1, switch to player2; otherwise, switch to player1
    }

    playTurn(coordinates) {
        const enemy =
            this.currentPlayer === this.player1
                ? this.player2
                : this.player1;

        const hit = this.currentPlayer.attack(
            enemy.gameboard,
            coordinates
        );

        if (hit === null) { // If the attack is invalid like attacking same cell.
            return null;
        }

        this.turn++; // Increment the turn count after a valid attack

        if (!hit) {
            this.switchPlayer();
        }

        return hit;
    }

    isGameOver() {
        return this.player1.gameboard.allShipsSunk() || this.player2.gameboard.allShipsSunk();
    }

    getWinner() {
        if (this.player1.gameboard.allShipsSunk()) {
            return this.player2;
        } else if (this.player2.gameboard.allShipsSunk()) {
            return this.player1;
        }
        return null;
    }

    createShips() {
        return [
            new Ship(5, "Carrier"),
            new Ship(4, "Battleship"),
            new Ship(3, "Cruiser"),
            new Ship(3, "Submarine"),
            new Ship(2, "Destroyer")
        ];
    }

    placeShipsRandomly(player) {
        for (const ship of player.availableShips) {
        let placed = false;

        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);

            const orientation =
                Math.random() < 0.5
                    ? 'horizontal'
                    : 'vertical';

            try {
                player.gameboard.placeShip(
                    ship,
                    [row, col],
                    orientation
                );

                placed = true;
            } catch (error) {
                // Handle the error
            }
        }
    }
    }
}
