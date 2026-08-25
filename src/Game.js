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
}