import {
    createBoard,
    createFleetInfo
} from './boardView.js';
import { createGameStatus } from './statusView.js';
import { createIntroModal } from './modalView.js';

const gameContainer = document.getElementById('game-container');

export function renderGame(game) {
    const gameStatusElement = createGameStatus(game);

    const fleetInfo = createFleetInfo(game.player1);

    const player1Board = createBoard(
        game.player1,
        game,
        gameStatusElement.turnCounter,
        null,
        gameStatusElement.gameStatus
    );
    const player2Board = createBoard(
        game.player2,
        game,
        gameStatusElement.turnCounter,
        player1Board.board,
        gameStatusElement.gameStatus
    );

    gameContainer.parentElement.insertBefore(
        gameStatusElement.element,
        gameContainer
    );
    gameContainer.appendChild(fleetInfo);
    gameContainer.appendChild(player1Board);
    gameContainer.appendChild(player2Board);

    const introModal = createIntroModal();
    document.body.appendChild(introModal);
}
