# Battleship

This is a Battleship game built with JavaScript as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship).

This project focuses on OOP, TDD, ES Modules and DOM manipulation.

## Features

- User place ships on a gameboard
- Sound for placing ships
- Enemy automatically places ships
- User and enemy attack each others board
- Hits and missed attacks are tracked
- Hit and miss sound for attacks
- Sunk ships are detected
- Sound for sinking
- Styling for hit,miss and sunk ships
- Game finishes when all ships have been sunk
- Different music for battle,winning and losing
- Enemy AI targets nearby cells if it hits a cell
- Enemy AI can figure out whether a ship is vertical or horizontal
- Enemy AI does not attack cells that are impossible to have ship

## Technologies

- **JavaScript**
- **JS Classes**
- **ES Modules**
- **Jest** — for testing
- **Babel** — allows Jest to work with ES Modules
- **HTML5**
- **CSS3**

## Testing

The game logic is developed using Test-Driven Development (TDD).

Jest is used to test the Classes that are core game logic, including:

- `Ship`
- `Gameboard`
- `Player`
- `Game`
- `Player`

DOM manipulation and UI behavior are kept separate from the core game logic and are not covered by the unit tests.

## Audio and Font

Sounds and music are license free audio files from Pixabay.
Barlow Condensed font is self hosted in the project via @fontface.

## Project Structure

- Project root contains main files like index.html,style.css ...
- src folder contains Classes such as Game,Player,Gameboard etc and dom files.
- tests folder contains jest files to test related Classes.
- fonts folder in src contains font files.
- images folder contains images like background.
- audio folder contains music and sound files.
