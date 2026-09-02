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
                const selectedShip = shipSelector.selection.ship;
                
                if (!selectedShip) {
                    return;
                }

                const coordinates = [
                    Number(cell.dataset.row),
                    Number(cell.dataset.col)
                ];
                
                const orientation = orientationSelector.orientation.value;

                try {
                    player.gameboard.placeShip(selectedShip, coordinates, orientation);
                    
                    // Remove the placed ship from available ships
                    const shipIndex = player.availableShips.indexOf(selectedShip);
                    if (shipIndex > -1) {
                        player.availableShips.splice(shipIndex, 1);
                    }
                    
                    // Clear selection and update ship buttons
                    shipSelector.clearSelection();
                    renderShips(player, board);
                } catch (error) {
                    console.error(error.message);
                }
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

    const shipButtons = {};

    function updateButtons() {
        player.availableShips.forEach((ship) => {
            if (!shipButtons[ship.name]) {
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
                shipButtons[ship.name] = shipButton;
            }
        });

        // Remove buttons for ships that have been placed
        Object.entries(shipButtons).forEach(([shipName, button]) => {
            const shipExists = player.availableShips.some(ship => ship.name === shipName);
            if (!shipExists) {
                button.remove();
                delete shipButtons[shipName];
            }
        });
    }

    updateButtons();

    return {
        element: shipContainer,
        selection,
        clearSelection() {
            if (selectedButton) {
                selectedButton.classList.remove('selected');
                selectedButton = null;
            }
            selection.ship = null;
            updateButtons();
        },
        updateButtons
    };
}

function createOrientationSelector() {
    const orientationContainer = document.createElement('div');
    orientationContainer.classList.add('orientation-container');

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
            const cell = board.children[row * 10 + col];
            if (player.gameboard.board[row][col] !== null) {
                cell.classList.add('ship-placed');
            } else {
                cell.classList.remove('ship-placed');
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

