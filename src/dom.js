const gameContainer = document.getElementById('game-container');

const hitSound = new Audio('../audio/cannon-shot.mp3');
const missSound = new Audio('../audio/splash.mp3');
const sinkSound = new Audio('../audio/sink.mp3');
const winSound = new Audio('../audio/win.mp3');
const lostSound = new Audio('../audio/lost.mp3');

let gamePhase = 'placement'; // 'placement' or 'battle' or 'game-over'
let gameStatus;

function createBoard(player, game, turnCounter, targetBoard = null) {
    const playerSection = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = player.name;

    const shipSelector = createShipSelector(player);
    const orientationSelector = createOrientationSelector();
    orientationSelector.element.classList.add('placement-control');

    if (player === game.player2) {
        shipSelector.element.classList.add('hidden');
        orientationSelector.element.classList.add('hidden');
    }

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

                if (gamePhase === "placement") {

                    if (player !== game.player1) {
                        return;
                    }

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
                        if (game.player1.availableShips.length === 0) {
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

                    if (game.currentPlayer === game.player1) {
                        gameStatus.textContent = 'YOUR TURN: ATTACK THE ENEMY FLEET';
                    } else {
                        gameStatus.textContent = 'ENEMY TURN: WAIT FOR YOUR TURN';

                        playAITurn(game, targetBoard, turnCounter);
                    }
                    if (hit === "sunk") {
                        const sunkShip =
                            enemy.gameboard.board[
                            Number(cell.dataset.row)
                            ][
                            Number(cell.dataset.col)
                            ];

                        for (let row = 0; row < 10; row++) {
                            for (let col = 0; col < 10; col++) {

                                if (enemy.gameboard.board[row][col] === sunkShip) {

                                    const sunkCell = board.children[row * 10 + col];

                                    sunkCell.textContent = 'X';
                                    sunkCell.classList.add('hit');
                                    sunkCell.classList.add('ship-sunk');

                                    setTimeout(() => {
                                        sunkCell.classList.add('reveal');
                                    }, 50);
                                }
                            }
                        }

                        hitSound.currentTime = 0;
                        hitSound.play();

                        hitSound.onended = () => {
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

                        const music = document.querySelector('.music-player audio');
                        music.pause();
                        music.currentTime = 0;

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

    playerSection.board = board; // Store the board reference in the playerSection for later use

    return playerSection;
}

function playAITurn(game, targetBoard, turnCounter) {
    setTimeout(() => {
        const aiAttack = game.playAITurn();

        if (!aiAttack) {
            return;
        }

        renderAIAttack(
            targetBoard,
            aiAttack.coordinates,
            aiAttack.result
        );
        
        if (aiAttack.result === "sunk") {
            hitSound.currentTime = 0;
            hitSound.play();
        } else if (aiAttack.result) {
            hitSound.currentTime = 0;
            hitSound.play();
        } else {
            missSound.currentTime = 0;
            missSound.play();
        }

        turnCounter.textContent = `TURN: ${game.turn}`;

        if (game.isGameOver()) {
            gamePhase = 'game-over';
            const winner = game.getWinner();
            const gameOverModal = createGameOverModal(game, winner);
            document.body.appendChild(gameOverModal);
            return;
        }

        if (aiAttack.result) {
            playAITurn(game, targetBoard, turnCounter);
        } else {
            gameStatus.textContent = 'YOUR TURN: ATTACK THE ENEMY FLEET';
        }
    }, 800);
}

function renderAIAttack(board, coordinates, result) {
    const [row, col] = coordinates;

    const cell = board.children[row * 10 + col];

    if (result === "sunk") {
        cell.textContent = "X";
        cell.classList.add("hit");
    } else if (result) {
        cell.textContent = "X";
        cell.classList.add("hit");
    } else {
        cell.textContent = "—";
        cell.classList.add("miss");
    }
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
    const music = document.querySelector('.music-player audio');

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
        music.volume = 0.5;
        setTimeout(() => {
            music.play().catch((error) => {
                console.error('Music playback was blocked:', error);
            });
        }, 1000);
        overlay.remove();
    });

    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(startButton);

    overlay.appendChild(modal);

    return overlay;
}

function createGameOverModal(game, winner) {
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

    const player1Board = createBoard(game.player1, game, gameStatusElement.turnCounter);
    const player2Board = createBoard(game.player2, game, gameStatusElement.turnCounter, player1Board.board);

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

