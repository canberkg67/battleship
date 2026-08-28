import { Player } from '../src/Player.js';

export class Game {
    constructor() {
        this.player1 = new Player();
        this.player2 = new Player();
        this.currentPlayer = this.player1;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        // If currentPlayer is player1, switch to player2; otherwise, switch to player1
    }

    playTurn(coordinates) {
        const enemy = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        const hit = this.currentPlayer.attack(enemy.gameboard, coordinates);

        if (!hit) {
            this.switchPlayer();
        }
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
}
