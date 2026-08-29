const gameContainer = document.getElementById('game-container');

function createBoard(player) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const board = document.createElement('div');
    board.classList.add('board');

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }

    playerSection.appendChild(title);
    playerSection.appendChild(board);

    return playerSection;
}

export function renderGame(game) {
    const player1Board = createBoard(game.player1);
    const player2Board = createBoard(game.player2);
    gameContainer.appendChild(player1Board);
    gameContainer.appendChild(player2Board);
}