import { hitSound, missSound, sinkSound, winSound, lostSound } from './audio.js';
import { createShipSelector, createOrientationSelector } from './selectors.js';
import { startBattle } from './statusView.js';
import { createGameOverModal } from './modalView.js';

let gamePhase = 'placement';

function playGameOverSound(game, winner) {
    const music = document.querySelector('.music-player audio');
    music.pause();
    music.currentTime = 0;

    const resultSound = winner === game.player1 ? winSound : lostSound;
    resultSound.currentTime = 0;
    resultSound.play();
}

export function createBoard(
    player,
    game,
    turnCounter,
    targetBoard = null,
    gameStatus
) {
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

                        placementSound.currentTime = 0;
                        placementSound.play();

                        const shipIndex = player.availableShips.indexOf(selectedShip);
                        if (shipIndex > -1) {
                            player.availableShips.splice(shipIndex, 1);
                        }

                        shipSelector.clearSelection();
                        renderShips(player, board);
                        if (game.player1.availableShips.length === 0) {
                            gamePhase = 'battle';
                            startBattle(gameStatus);
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

                        playAITurn(game, targetBoard, turnCounter, gameStatus);
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
                        playGameOverSound(game, winner);

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

    playerSection.board = board;

    return playerSection;
}

function playAITurn(game, targetBoard, turnCounter, gameStatus) {
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
            playGameOverSound(game, winner);
            const gameOverModal = createGameOverModal(game, winner);
            document.body.appendChild(gameOverModal);
            return;
        }

        if (aiAttack.result) {
            playAITurn(game, targetBoard, turnCounter, gameStatus);
        } else {
            gameStatus.textContent = 'YOUR TURN: ATTACK THE ENEMY FLEET';
        }
    }, 1100);
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

export function createFleetInfo(player) {
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

export function renderShips(player, board) {
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