const gameContainer = document.getElementById('game-container');

function createBoard(player) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const shipSelector = createShipSelector(player);

    const board = document.createElement('div');
    board.classList.add('board');

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener('click', () => {
                const coordinates = [
                    Number(cell.dataset.row),
                    Number(cell.dataset.col)
                ];
                console.log("Clicked cell coordinates:", coordinates);
            });

            board.appendChild(cell);
        }
    }
    
    const orientationSelector = createOrientationSelector(player);

    playerSection.appendChild(title);
    playerSection.appendChild(shipSelector);
    playerSection.appendChild(orientationSelector);
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

function createOrientationSelector() {
    const orientationContainer = document.createElement('div');

    let selectedOrientation = 'horizontal';

    const horizontalButton = document.createElement('button');
    horizontalButton.textContent = 'Horizontal';

    const verticalButton = document.createElement('button');
    verticalButton.textContent = 'Vertical';

    horizontalButton.addEventListener('click', () => {
        selectedOrientation = 'horizontal';
    });

    verticalButton.addEventListener('click', () => {
        selectedOrientation = 'vertical';
    });

    orientationContainer.appendChild(horizontalButton);
    orientationContainer.appendChild(verticalButton);

    return orientationContainer;
}

export function renderGame(game) {
    const player1Board = createBoard(game.player1);
    const player2Board = createBoard(game.player2);
    gameContainer.appendChild(player1Board);
    gameContainer.appendChild(player2Board);
}