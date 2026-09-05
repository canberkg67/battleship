export function createShipSelector(player) {
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

export function createOrientationSelector() {
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