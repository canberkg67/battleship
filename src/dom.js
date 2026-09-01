const gameContainer = document.getElementById('game-container');

function createBoard(player) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const shipSelector = createShipSelector(player);

    const board = document.createElement('div');
    board.classList.add('board');

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }

    playerSection.appendChild(title);
    playerSection.appendChild(shipSelector);
    playerSection.appendChild(board);

    return playerSection;
}

let selectedButton = null;
let selectedShip = null;

function createShipSelector(player) {
    const shipContainer = document.createElement('div');
    shipContainer.classList.add('ship-container');

    player.availableShips.forEach((ship) => {
        const shipButton = document.createElement('button');
        shipButton.classList.add('ship');
        shipButton.textContent = ship.name;
        shipButton.dataset.ship = ship.name;

        shipButton.addEventListener('click', () => {
            if (selectedButton) {
                selectedButton.classList.remove('selected');
            }
            shipButton.classList.add('selected');
            selectedButton = shipButton;
            selectedShip = ship;
        });

        shipContainer.appendChild(shipButton);
    });

    return shipContainer;
}

export function renderGame(game) {
    const player1Board = createBoard(game.player1);
    const player2Board = createBoard(game.player2);
    gameContainer.appendChild(player1Board);
    gameContainer.appendChild(player2Board);
}