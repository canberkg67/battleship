//This will control attacks of AI behaviour

export class AI {
    constructor() {
        this.attackedCoordinates = [];
        this.targetCoordinates = [];
        this.hitCoordinates = [];
        this.direction = null;
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

    processResult(coordinates, result) {
        if (result === 'sunk') {
            this.hitCoordinates = [];
            this.targetCoordinates = [];
            this.direction = null;
            return;
        }

        if (result === true) {
            this.hitCoordinates.push(coordinates);

            if (this.hitCoordinates.length === 1) {
                this.addAdjacentCoordinates(coordinates);
                return;
            }

            this.determineDirection();
        }
    }

    addAdjacentCoordinates([row, col]) {
        const adjacentCoordinates = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];

        adjacentCoordinates.sort(() => Math.random() - 0.5);

        adjacentCoordinates.forEach(([newRow, newCol]) => {
            this.addTargetCoordinate(newRow, newCol);
        });
    }

    determineDirection() {
        const [firstHit, secondHit] = this.hitCoordinates;

        if (firstHit[0] === secondHit[0]) {
            this.direction = 'horizontal';
        } else if (firstHit[1] === secondHit[1]) {
            this.direction = 'vertical';
        }

        this.targetCoordinates = [];

        if (this.direction === 'horizontal') {
            const row = firstHit[0];

            const columns = this.hitCoordinates.map(
                ([, col]) => col
            );

            const minCol = Math.min(...columns);
            const maxCol = Math.max(...columns);

            this.addTargetCoordinate(row, minCol - 1);
            this.addTargetCoordinate(row, maxCol + 1);
        }

        if (this.direction === 'vertical') {
            const column = firstHit[1];

            const rows = this.hitCoordinates.map(
                ([row]) => row
            );

            const minRow = Math.min(...rows);
            const maxRow = Math.max(...rows);

            this.addTargetCoordinate(minRow - 1, column);
            this.addTargetCoordinate(maxRow + 1, column);
        }
    }

    addTargetCoordinate(row, col) {
        if (
            row >= 0 &&
            row < 10 &&
            col >= 0 &&
            col < 10 &&
            !this.attackedCoordinates.some(
                ([attackedRow, attackedCol]) =>
                    attackedRow === row &&
                    attackedCol === col
            ) &&
            !this.targetCoordinates.some(
                ([targetRow, targetCol]) =>
                    targetRow === row &&
                    targetCol === col
            )
        ) {
            this.targetCoordinates.push([row, col]);
        }
    }
}
