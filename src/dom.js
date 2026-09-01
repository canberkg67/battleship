const gameContainer = document.getElementById('game-container');

function createBoard(player) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const shipSelector = createShipSelector(player);
    const orientationSelector = createOrientationSelector();

    const board = document.createElement('div');
    board.classList.add('board');

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener('click', () => {
                const  selectedShip = shipSelector.selection.ship;
                
                if (!selectedShip) {
                    return;
                }


                
                const coordinates = [
                    Number(cell.dataset.row),
                    Number(cell.dataset.col)
                ];
                
                const orientation = orientationSelector.orientation.value;

                player.gameboard.placeShip(selectedShip, coordinates, orientation);

                renderShips(player, board);
            });

            board.appendChild(cell);
        }
    }
    

    playerSection.appendChild(title);
    playerSection.appendChild(shipSelector.element);
    playerSection.appendChild(orientationSelector.element);
    playerSection.appendChild(board);

    return playerSection;
}


function createShipSelector(player) {
    const shipContainer = document.createElement('div');
    shipContainer.classList.add('ship-container');

    let selectedButton = null;

    const selection = {
        ship: null
    };

    player.availableShips.forEach((ship) => {
        const shipButton = document.createElement('button');
        shipButton.classList.add('ship');
        shipButton.textContent = ship.name;
        

        shipButton.addEventListener('click', () => {
            if (selectedButton) {
                selectedButton.classList.remove('selected');
            }
            shipButton.classList.add('selected');
            selectedButton = shipButton;
            selection.ship = ship;
        });

        shipContainer.appendChild(shipButton);
    });

    return {
        element: shipContainer,
        selection
    };
}

function createOrientationSelector() {
    const orientationContainer = document.createElement('div');

    const orientation = {
        value: 'horizontal'
    };

    const horizontalButton = document.createElement('button');
    horizontalButton.textContent = 'Horizontal';

    const verticalButton = document.createElement('button');
    verticalButton.textContent = 'Vertical';

    horizontalButton.addEventListener('click', () => {
        orientation.value = 'horizontal';
    });

    verticalButton.addEventListener('click', () => {
        orientation.value = 'vertical';
    });

    orientationContainer.appendChild(horizontalButton);
    orientationContainer.appendChild(verticalButton);

    return {
        element: orientationContainer,
        orientation
    };
}

function renderShips(player , board) {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if (player.gameboard.board[row][col] !== null) {
                const cell = board.children[row * 10 + col];
                cell.classList.add('ship-placed');
            }
        }
}
}

export function renderGame(game) {
    const player1Board = createBoard(game.player1);
    const player2Board = createBoard(game.player2);
    gameContainer.appendChild(player1Board);
    gameContainer.appendChild(player2Board);
}

