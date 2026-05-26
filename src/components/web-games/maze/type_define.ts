// ---------------------------------------------
// General
// ---------------------------------------------

export enum Direction {
    TOP = 0,
    LEFT = 1,
    BOTTOM = 2,
    RIGHT = 3
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone(): Position {
        return new Position(this.x, this.y);
    }
    
    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Position): Position {
        return new Position(this.x + other.x, this.y + other.y);
    }

    sub(other: Position): Position {
        return new Position(this.x - other.x, this.y - other.y);
    }

    mul(factor: number): Position {
        return new Position(this.x * factor, this.y * factor);
    }

    translateXY(deltaX: number, deltaY: number): Position {
        return new Position(this.x + deltaX, this.y + deltaY);
    }

    translatePosition(delta: Position): Position {
        return new Position(this.x + delta.x, this.y + delta.y);
    }
    
    distance(other: Position): number {
        const deltaX = this.x - other.x;
        const deltaY = this.y - other.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    
    normalize(): Position {
        const length = this.distance(new Position(0, 0));
        return new Position(this.x / length, this.y / length);
    }
    
    dot(other: Position): number {
        return this.x * other.x + this.y * other.y;
    }
}

export interface Size {
    width: number;
    height: number;
}
export const DefaultSize: Size = {
    width: 0,
    height: 0
}

export class Block {
    row: number;
    col: number;
    
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    equals(other: Block): boolean {
        return this.row === other.row && this.col === other.col;
    }

    top(): Block {
        return new Block(this.row - 1, this.col);
    }

    bottom(): Block {
        return new Block(this.row + 1, this.col);
    }

    left(): Block {
        return new Block(this.row, this.col - 1);
    }

    right(): Block {
        return new Block(this.row, this.col + 1);
    }

    clone(): Block {
        return new Block(this.row, this.col);
    }
}

export class GridPointPosition extends Block {
    constructor(row: number, col: number) {
        super(row, col);
    }
}

export interface Player {
    position: Position;
    radius: number;
    speed: number;
}

// ---------------------------------------------
// Drawer
// ---------------------------------------------

export interface CanvasSize extends Size {
}

export interface DrawerInfo {
    canvasSize: CanvasSize;
    blockSize: number;
    wallSize: number;
    unitSize: number;
}
export const DefaultDrawerInfo: DrawerInfo = {
    canvasSize: {
        width: 0,
        height: 0
    },
    blockSize: 0,
    wallSize: 0,
    unitSize: 0
}

// ---------------------------------------------
// Game Core
// ---------------------------------------------

export interface MazeSize {
    cols: number;
    rows: number;
}
export const DefaultMazeSize: MazeSize = {
    cols: 10,
    rows: 10
};

export class Maze {
    size: MazeSize;
    grid: number[][];

    constructor(size: MazeSize, grid: number[][]) {
        this.size = size;
        this.grid = grid;
    }

    getBlock(block: Block): number {
        return this.grid[block.row][block.col];
    }

    setBlock(block: Block, value: number): void {
        this.grid[block.row][block.col] = value;
    }

    hasWall(block: Block, direction: Direction): boolean {
        switch (direction) {
            case Direction.TOP:
                return block.row == 0 || Math.abs(this.getBlock(block) - this.getBlock(block.top())) !== 1;
            case Direction.BOTTOM:
                return block.row == this.size.rows - 1 || Math.abs(this.getBlock(block) - this.getBlock(block.bottom())) !== 1;
            case Direction.LEFT:
                return block.col == 0 || Math.abs(this.getBlock(block) - this.getBlock(block.left())) !== 1;
            case Direction.RIGHT:
                return block.col == this.size.cols - 1 || Math.abs(this.getBlock(block) - this.getBlock(block.right())) !== 1;
        }
    }
}

// ---------------------------------------------
// Maze Segment
// ---------------------------------------------

export enum GridPoint {
    TOP_LEFT = 0,
    BOTTOM_LEFT = 1,
    BOTTOM_RIGHT = 2,
    TOP_RIGHT = 3
}

export interface MazeSegmentTracer {
    block: Block;
    point: GridPoint;
}
export const DefaultMazeSegmentTracer: MazeSegmentTracer = {
    block: new Block(0, 0),
    point: GridPoint.TOP_LEFT
}

export type Segment = 
    | { type: "line", pos1: Position, pos2: Position }
    | { type: "arc", center: Position, radius: number, start: number, end: number, counterClockWise: boolean };

// ---------------------------------------------
// Collision
// ---------------------------------------------

export interface AABB {
    min: Position;
    max: Position;
}

export interface CollisionResult {
    collided: boolean;
    penetration: number;
    normal: Position;
}
export const DefaultCollisionResult: CollisionResult = {
    collided: false,
    penetration: 0,
    normal: new Position(0, 0)
}
