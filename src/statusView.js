export function createGameStatus(game) {
    const container = document.createElement('div');
    container.classList.add('game-status');

    const gameStatus = document.createElement('h2');
    gameStatus.textContent = 'DEPLOY YOUR FLEET';

    const turnCounter = document.createElement('p');
    turnCounter.textContent = `TURN: ${game.turn}`;

    container.appendChild(gameStatus);
    container.appendChild(turnCounter);

    return {
        element: container,
        turnCounter,
        gameStatus
    };
}

export function startBattle(gameStatus) {
    console.log('Battle started');
    const sound = new Audio('../audio/battle-start-horn.mp3');
    sound.play();
    gameStatus.textContent = 'YOUR TURN: ATTACK THE ENEMY FLEET';

    document.querySelectorAll('.placement-control').forEach(element => {
        element.classList.add('hidden');
    });
}