# Battleship

A Battleship game built with JavaScript as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship).

The project focuses on OOP, TDD, ES Modules and DOM manipulation.

## Features

- Place ships on a game board
- Attack the opponent's board
- Track hits and missed attacks
- Detect when ships are sunk
- Detect when all ships have been sunk
- Human vs. computer gameplay
- Randomized computer attacks
- Responsive game interface

## Technologies

- **JavaScript**
- **ES Modules**
- **Jest** — for testing
- **Babel** — allows Jest to work with ES Modules
- **HTML5**
- **CSS3**

## Testing

The game logic is developed using Test-Driven Development (TDD).

Jest is used to test the core game logic, including:

- `Ship`
- `Gameboard`
- `Player`

DOM manipulation and UI behavior are kept separate from the core game logic and are not covered by the unit tests.

## Project Structure

src/
├── Ship.js
├── Gameboard.js
├── Player.js
└── ...

tests/
├── Ship.test.js
├── Gameboard.test.js
└── Player.test.js
