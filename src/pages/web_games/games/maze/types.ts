enum Direction {
    TOP,
    LEFT,
    BOTTOM,
    RIGHT
}

class Position {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public translate(deltaX: number, deltaY: number): Position {
        return new Position(this.x + deltaX, this.y + deltaY);
    }

    public clone(): Position {
        return new Position(this.x, this.y);
    }

    public distance(other: Position): number {
        const deltaX = this.x - other.x;
        const deltaY = this.y - other.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
}

class BlockPosition {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public top(): BlockPosition {
        return new BlockPosition(this.x, this.y - 1);
    }

    public left(): BlockPosition {
        return new BlockPosition(this.x - 1, this.y);
    }

    public bottom(): BlockPosition {
        return new BlockPosition(this.x, this.y + 1);
    }

    public right(): BlockPosition {
        return new BlockPosition(this.x + 1, this.y);
    }

    public equal(other: BlockPosition): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public clone(): BlockPosition {
        return new BlockPosition(this.x, this.y);
    }

    public copy(other: BlockPosition) {
        this.x = other.x;
        this.y = other.y;
    }
}

export { BlockPosition, Direction, Position };

