import { Gameboard } from './Gameboard.js';

export class Player {
    constructor() {
        this.gameboard = new Gameboard();
    }
    attack(enemyGameboard, coordinates) {
        return enemyGameboard.receiveAttack(coordinates);
    }
}