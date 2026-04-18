import { BlockPosition, Direction, Position } from "./types";

interface Maze {
    maze: number[][];
    cols: number;
    rows: number;
}

enum KeyMap {
    W = 0x57,
    A = 0x41,
    S = 0x53,
    D = 0x44,
    UP = 0x26,
    LEFT = 0x25,
    DOWN = 0x28,
    RIGHT = 0x27
}

class Player {
    pos: Position;
    radius: number;
    moveSpeed: number;

    constructor(pos: Position = new Position(), radius: number = 0, moveSpeed: number = 0) {
        this.pos = pos;
        this.radius = radius;
        this.moveSpeed = moveSpeed;
    }

    public moveX(delta: number) {
        this.pos.x += delta;
    }

    public moveY(delta: number) {
        this.pos.y += delta;
    }

    public move(delta: Position) {
        this.pos.x += delta.x;
        this.pos.y += delta.y;
    }
}

function mazeGenCheckAvailable(
    maze: number[][],
    size: {
        cols: number,
        rows: number
    },
    pos: Position
): Position[] {
    let result: Position[] = [];

    if (0 < pos.y && maze[pos.y - 1][pos.x] === 0) result.push(new Position(pos.x, pos.y - 1));
    if (pos.y < size.rows - 1 && maze[pos.y + 1][pos.x] === 0) result.push(new Position(pos.x, pos.y + 1 ));
    if (0 < pos.x && maze[pos.y][pos.x - 1] === 0) result.push(new Position(pos.x - 1, pos.y));
    if (pos.x < size.cols - 1 && maze[pos.y][pos.x + 1] === 0) result.push(new Position(pos.x + 1, pos.y));

    return result;
}

function generateMaze(
    size: {
        cols: number,
        rows: number
    }
): Maze {
    let maze = Array.from({ length: size.rows }, () => Array(size.cols).fill(0));
    let pathStack: Position[] = [];

    maze[0][0] = 1;
    pathStack.push(new Position());

    while (pathStack.length !== 0) {
        let pos = pathStack[pathStack.length - 1];
        let move = mazeGenCheckAvailable(maze, size, pos);

        if (move.length === 0) {
            pathStack.pop();
            continue;
        }

        let nextPos = move[Math.floor(Math.random() * move.length)];
        maze[nextPos.y][nextPos.x] = maze[pos.y][pos.x] + 1;
        pathStack.push(nextPos);
    }

    return {
        maze: maze,
        cols: size.cols,
        rows: size.rows
    };
}

function defaultMoveKeys(): Map<KeyMap, boolean> {
    let result = new Map<KeyMap, boolean>();
    result.set(KeyMap.W, false);
    result.set(KeyMap.A, false);
    result.set(KeyMap.S, false);
    result.set(KeyMap.D, false);
    result.set(KeyMap.UP, false);
    result.set(KeyMap.LEFT, false);
    result.set(KeyMap.DOWN, false);
    result.set(KeyMap.RIGHT, false);
    return result;
}

function emptyPlayer(): Player {
    return new Player();
}

function defaultPlayer(edgeSize: number, blockSize: number): Player {
    return new Player(
        new Position(
            (2 * edgeSize + blockSize) / 2,
            (2 * edgeSize + blockSize) / 2
        ),
        Math.floor(blockSize / 4),
        edgeSize + blockSize
    );
}


function hasWall(maze: Maze, pos: BlockPosition, direction: Direction): boolean {
    switch (direction) {
        case Direction.TOP:
            return pos.y == 0 || Math.abs(maze.maze[pos.y][pos.x] - maze.maze[pos.y - 1][pos.x]) !== 1
        case Direction.LEFT:
            return pos.x == 0 || Math.abs(maze.maze[pos.y][pos.x] - maze.maze[pos.y][pos.x - 1]) !== 1
        case Direction.BOTTOM:
            return pos.y == maze.rows - 1 || Math.abs(maze.maze[pos.y][pos.x] - maze.maze[pos.y + 1][pos.x]) !== 1
        case Direction.RIGHT:
            return pos.x == maze.cols - 1 || Math.abs(maze.maze[pos.y][pos.x] - maze.maze[pos.y][pos.x + 1]) !== 1
    }
}

function getGridPointWalls(
    maze: Maze,
    pos: BlockPosition
): {
    top: boolean,
    left: boolean,
    bottom: boolean,
    right: boolean 
} {
    return {
        top: pos.y != 0 && (pos.x == maze.cols || hasWall(maze, pos.top(), Direction.LEFT)),
        left: pos.x != 0 && (pos.y == maze.rows || hasWall(maze, pos.left(), Direction.TOP)),
        bottom: pos.y != maze.rows && (pos.x == maze.cols || hasWall(maze, pos, Direction.LEFT)),
        right: pos.x != maze.cols && (pos.y == maze.rows || hasWall(maze, pos, Direction.TOP))
    };
}

export {
    defaultMoveKeys, defaultPlayer, emptyPlayer, generateMaze, getGridPointWalls, hasWall, KeyMap
};
export type { Maze, Player, Position };

