import { Gameboard } from './Gameboard.js';

export class Player {
    constructor(name) {
        this.gameboard = new Gameboard();
        this.name = name;
    }
    attack(enemyGameboard, coordinates) {
        return enemyGameboard.receiveAttack(coordinates);
    }
}