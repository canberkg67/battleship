const gameContainer = document.getElementById('game-container');

let gamePhase = 'placement'; // 'placement' or 'battle'
let gameStatus;

function createBoard(player) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const shipSelector = createShipSelector(player);
    const orientationSelector = createOrientationSelector();

    const placementSound = new Audio('../audio/ship-bell.mp3');

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

                    placementSound.currentTime = 0; // Reset the sound to the beginning after each play
                    placementSound.play();
                    
                    // Remove the placed ship from available ships
                    const shipIndex = player.availableShips.indexOf(selectedShip);
                    if (shipIndex > -1) {
                        player.availableShips.splice(shipIndex, 1);
                    }
                    
                    // Clear selection and update ship buttons
                    shipSelector.clearSelection();
                    renderShips(player, board);
                    if (player.availableShips.length === 0) {
                        // All ships placed, switch to battle phase
                        gamePhase = 'battle';
                        startBattle();
                    }
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

function createGameStatus() {
    gameStatus = document.createElement('h2');
    gameStatus.textContent = 'DEPLOY YOUR FLEET';
    return gameStatus;
}

function startBattle() {
    console.log('Battle started');
    gameStatus.textContent = 'YOUR TURN: ATTACK THE ENEMY FLEET';
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

function createFleetInfo(player) {
    const container = document.createElement('div');
    container.classList.add('fleet-info');

    const title = document.createElement('h3');
    title.textContent = 'Ships';

    container.appendChild(title);

    player.availableShips.forEach((ship) => {
        const shipInfo = document.createElement('div');
        shipInfo.classList.add('ship-info');

        const name = document.createElement('span');
        name.textContent = ship.name;

        const cells = document.createElement('div');
        cells.classList.add('ship-info-cells');

        for (let i = 0; i < ship.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('ship-info-cell');
            cells.appendChild(cell);
        }

        shipInfo.appendChild(name);
        shipInfo.appendChild(cells);

        container.appendChild(shipInfo);
    });

    return container;
}

function createIntroModal() {
    const sound = new Audio('../audio/cannon-shot.mp3');
    
    const overlay = document.createElement('div');
    overlay.classList.add('intro-overlay');

    const modal = document.createElement('div');
    modal.classList.add('intro-modal');

    const title = document.createElement('h2');
    title.textContent = 'WELCOME ADMIRAL!';

    const description = document.createElement('div');
    description.innerHTML =
        `<p>- Choose ships and their orientations</p>
        <p>- Deploy your ships by clicking on the cells</p>
        <p>- Click on the enemy board to attack</p>
        <p>- Sink all enemy ships to win</p>
        `;

    const startButton = document.createElement('button');
    startButton.textContent = 'START';

    startButton.addEventListener('click', () => {
        sound.play();
        overlay.remove();
    });

    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(startButton);

    overlay.appendChild(modal);

    return overlay;
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
    const gameStatusElement = createGameStatus();

    const fleetInfo = createFleetInfo(game.player1);

    const player1Board = createBoard(game.player1);
    const player2Board = createBoard(game.player2);
    
    gameContainer.parentElement.insertBefore(gameStatusElement, gameContainer);
    gameContainer.appendChild(fleetInfo);
    gameContainer.appendChild(player1Board);
    gameContainer.appendChild(player2Board);

    const introModal = createIntroModal();
    document.body.appendChild(introModal);
}

