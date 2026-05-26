import type { MazeSize } from "./type_define";
import { Block, Maze } from "./type_define";

function genMazeCheckWalkable(
    maze: Maze,
    pos: Block
): boolean {
    if (pos.row < 0 || pos.row >= maze.size.rows || pos.col < 0 || pos.col >= maze.size.cols) {
        return false;
    }
    return maze.grid[pos.row][pos.col] === 0;
}

function genMazeGetMovableBlocks(
    maze: Maze,
    pos: Block
): Block[] {
    return [pos.top(), pos.bottom(), pos.left(), pos.right()]
        .filter(p => genMazeCheckWalkable(maze, p));
}

export function generateMaze(
    size: MazeSize
): Maze {
    let maze: Maze = new Maze(
        { ...size },
        Array.from({ length: size.rows }, () => Array(size.cols).fill(0))
    );
    let pathStack: Block[] = [];

    pathStack.push(new Block(0, 0));
    maze.setBlock(pathStack[0], 1);

    while (pathStack.length !== 0) {
        const pos = pathStack[pathStack.length - 1];
        const moves = genMazeGetMovableBlocks(maze, pos);

        if (moves.length === 0) {
            pathStack.pop();
        } else {
            let nextPos = moves[Math.floor(Math.random() * moves.length)];
            maze.setBlock(nextPos, maze.getBlock(pos) + 1);
            pathStack.push(nextPos);
        }
    }

    return maze;
}
