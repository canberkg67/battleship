//This will control attacks of AI behaviour

export class AI {
    constructor() {
        this.attackedCoordinates = [];
        this.targetCoordinates = [];
        this.hitCoordinates = [];
        this.direction = null;
        this.missedCoordinates = [];
    }

    chooseAttack() {
        let coordinates;

        while (this.targetCoordinates.length > 0) {
            const target = this.targetCoordinates.shift();

            if (!this.isImpossibleCell(target)) {
                coordinates = target;
                break;
            }
        }

        if (!coordinates) {
            const availableCoordinates = [];

            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const candidate = [row, col];

                    if (
                        !this.attackedCoordinates.some(
                            ([attackedRow, attackedCol]) =>
                                attackedRow === row && attackedCol === col
                        ) &&
                        !this.isImpossibleCell(candidate)
                    ) {
                        availableCoordinates.push(candidate);
                    }
                }
            }

            if (availableCoordinates.length === 0) {
                return null;
            }

            coordinates = availableCoordinates[
                Math.floor(Math.random() * availableCoordinates.length)
            ];
        }

        this.attackedCoordinates.push(coordinates);

        return coordinates;
    }

    isImpossibleCell([row, col]) {
        const adjacentCoordinates = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];

        return adjacentCoordinates.every(([adjacentRow, adjacentCol]) => {
            if (
                adjacentRow < 0 ||
                adjacentRow >= 10 ||
                adjacentCol < 0 ||
                adjacentCol >= 10
            ) {
                return true;
            }

            return this.missedCoordinates.some(
                ([missedRow, missedCol]) =>
                    missedRow === adjacentRow && missedCol === adjacentCol
            );
        });
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
        if (result === false) {
            this.missedCoordinates.push(coordinates);
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
