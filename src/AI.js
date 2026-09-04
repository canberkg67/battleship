//This will control attacks of AI behaviour

export class AI {
    constructor() {
        this.attackedCoordinates = [];
    }

    chooseAttack() {
        let coordinates;

        do {
            coordinates = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10)
            ];
        } while (
            this.attackedCoordinates.some(
                ([row, col]) =>
                    row === coordinates[0] &&
                    col === coordinates[1]
            )
        );

        this.attackedCoordinates.push(coordinates);

        return coordinates;
    }
}