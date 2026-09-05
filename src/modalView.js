export function createIntroModal() {
    const sound = new Audio('./audio/cannon-shot.mp3');
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

export function createGameOverModal(game, winner) {
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