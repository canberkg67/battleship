const gameContainer = document.getElementById('game-container');

let gamePhase = 'placement'; // 'placement' or 'battle' or 'game-over'
let gameStatus;

function createBoard(player, game , turnCounter) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const shipSelector = createShipSelector(player);
    const orientationSelector = createOrientationSelector();
    orientationSelector.element.classList.add('placement-control');

    const placementSound = new Audio('../audio/ship-bell.mp3');
    const hitSound = new Audio('../audio/cannon-shot.mp3');
    const missSound = new Audio('../audio/splash.mp3');
    const sinkSound = new Audio('../audio/sink.mp3');
    const winSound = new Audio('../audio/win.mp3');
    const lostSound = new Audio('../audio/lost.mp3');

    const board = document.createElement('div');
    board.classList.add('board');

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener('click', () => {

                if (gamePhase === "placement") {
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
                        if (game.player1.availableShips.length === 0 &&
                            game.player2.availableShips.length === 0) {
                            // All ships placed, switch to battle phase
                            gamePhase = 'battle';
                            startBattle();
                        }
                    } catch (error) {
                        console.error(error.message);
                    }
                    return;
                }

                if (gamePhase === "battle") {
                    const enemy =
                        game.currentPlayer === game.player1
                            ? game.player2
                            : game.player1;

                    if (player !== enemy) {
                        return;
                    }

                    const coordinates = [
                        Number(cell.dataset.row),
                        Number(cell.dataset.col)
                    ];

                    const hit = game.playTurn(coordinates);

                    if (hit === null) {
                        return;
                    }

                    turnCounter.textContent = `TURN: ${game.turn}`;

                    if (hit === "sunk") {
                        cell.textContent = 'X';
                        cell.classList.add('hit');
                        
                        hitSound.currentTime = 0;
                        hitSound.play();

                        hitSound.onended = () => { // Play the sink sound after the hit sound finishes
                            sinkSound.currentTime = 0;
                            sinkSound.play();
                        };
                    } else if (hit) {
                        cell.textContent = 'X';
                        cell.classList.add('hit');

                        hitSound.currentTime = 0;
                        hitSound.play();
                    } else {
                        cell.textContent = '—';
                        cell.classList.add('miss');

                        missSound.currentTime = 0;
                        missSound.play();
                    }

                    if (game.isGameOver()) {
                        const winner = game.getWinner();
                        console.log(`${winner.name} wins!`);

                        gamePhase = 'game-over';

                        if (winner === game.player1) {
                            winSound.currentTime = 0;
                            winSound.play();
                        } else {
                            lostSound.currentTime = 0;
                            lostSound.play();
                        }

                        const gameOverModal = createGameOverModal(game, winner);
                        document.body.appendChild(gameOverModal);
                    }
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

function createGameStatus(game) {
    const container = document.createElement('div');
    container.classList.add('game-status');

    gameStatus = document.createElement('h2');
    gameStatus.textContent = 'DEPLOY YOUR FLEET';

    const turnCounter = document.createElement('p');
    turnCounter.textContent = `TURN: ${game.turn}`;

    container.appendChild(gameStatus);
    container.appendChild(turnCounter);

    return {
        element: container,
        turnCounter
    };
}

function startBattle() {
    console.log('Battle started');
    const sound = new Audio('../audio/battle-start-horn.mp3');
    sound.play();
    gameStatus.textContent = 'YOUR TURN: ATTACK THE ENEMY FLEET';

    document.querySelectorAll('.placement-control').forEach(element => {
        element.classList.add('hidden');
    });
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

function createGameOverModal(game,winner) {
    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');

    const modal = document.createElement('div');
    modal.classList.add('game-over-modal');

    const title = document.createElement('h2');

    if (winner === game.player1) {
        title.textContent = 'YOU WIN!';
    } else {
        title.textContent = 'YOU LOST!';
    }

    const message = document.createElement('p');

    if (winner === game.player1) {
        message.textContent = 'All enemy ships have been sunk.';
    } else {
        message.textContent = 'Your fleet has been destroyed.';
    }

    modal.appendChild(title);
    modal.appendChild(message);
    overlay.appendChild(modal);

    return overlay;
}


function renderShips(player, board) {
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
    const gameStatusElement = createGameStatus(game);

    const fleetInfo = createFleetInfo(game.player1);

    const player1Board = createBoard(game.player1, game , gameStatusElement.turnCounter);
    const player2Board = createBoard(game.player2, game, gameStatusElement.turnCounter);

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

