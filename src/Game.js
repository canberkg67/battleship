import { Player } from '../src/Player.js';

export class Game {
    constructor() {
        this.player1 = new Player();
        this.player2 = new Player();
        this.currentPlayer = this.player1;
    }
}