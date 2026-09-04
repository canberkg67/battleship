//This will control attacks of AI behaviour

export class AI {
    constructor() {
        this.attackedCoordinates = [];
        this.targetCoordinates = [];
    }

    chooseAttack() {
        let coordinates;

        if (this.targetCoordinates.length > 0) {
            coordinates = this.targetCoordinates.shift();
        } else {
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
        }

        this.attackedCoordinates.push(coordinates);

        return coordinates;
    }

    addAdjacentCoordinates([row, col]) {
        const adjacentCoordinates = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];

        adjacentCoordinates.forEach(([newRow, newCol]) => {
            if (
                newRow >= 0 &&
                newRow < 10 &&
                newCol >= 0 &&
                newCol < 10 &&
                !this.attackedCoordinates.some(
                    ([attackedRow, attackedCol]) =>
                        attackedRow === newRow &&
                        attackedCol === newCol
                ) &&
                !this.targetCoordinates.some(
                    ([targetRow, targetCol]) =>
                        targetRow === newRow &&
                        targetCol === newCol
                )
            ) {
                this.targetCoordinates.push([newRow, newCol]);
            }
        });
    }

    processResult(coordinates, result) {
        if (result === true) {
            this.addAdjacentCoordinates(coordinates);
        }

        if (result === 'sunk') {
            this.targetCoordinates = [];
        }
    }

}