import type { CanvasInfo } from "./canvas_drawer";
import { getGridPointWalls, type Maze } from "./game_control";
import { BlockPosition, Position } from "./types";

enum MazeBlockPoint {
    TOP_LEFT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    TOP_RIGHT
}

interface MazeSegmentTracer {
    block: BlockPosition;
    point: MazeBlockPoint;
}

type Segment = 
    | { type: "line", pos1: Position, pos2: Position }
    | { type: "arc", center: Position, radius: number, start: number, end: number, counterClockWise: boolean };


function getGridPointCornerPos(
    canvasInfo: CanvasInfo,
    pos: BlockPosition
): {
    topLeft: Position,
    bottomLeft: Position,
    bottomRight: Position,
    topRight: Position
} {
    const { wallSize, unitSize } = canvasInfo;
    return {
        topLeft: new Position(pos.x * unitSize, pos.y * unitSize),
        bottomLeft: new Position(pos.x * unitSize, pos.y * unitSize + wallSize),
        bottomRight: new Position(pos.x * unitSize + wallSize, pos.y * unitSize + wallSize),
        topRight: new Position(pos.x * unitSize + wallSize, pos.y * unitSize)
    }
}

function strokeSegmentFromTopLeft(
    maze: Maze,
    canvasInfo: CanvasInfo,
    mazePos: MazeSegmentTracer,
    result: Segment[]
): MazeSegmentTracer {
    const { blockSize, wallSize } = canvasInfo;
    const { block: pos } = mazePos;

    let { left, bottom, right } = getGridPointWalls(maze, pos.bottom());
    let cornerPos = getGridPointCornerPos(canvasInfo, pos.bottom());
    
    result.push({
        type: "line",
        pos1: cornerPos.topRight.translate(0, -blockSize + 0.5 * wallSize),
        pos2: cornerPos.topRight.translate(0, -0.5 * wallSize)
    });

    if (right) {
        result.push({
            type: "arc",
            center: cornerPos.topRight.translate(0.5 * wallSize, -0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: Math.PI,
            end: Math.PI * 0.5,
            counterClockWise: true
        });
        return {
            block: pos.clone(),
            point: MazeBlockPoint.BOTTOM_LEFT
        };
    } else if (bottom) {
        result.push({
            type: "line",
            pos1: cornerPos.topRight.translate(0, -0.5 * wallSize),
            pos2: cornerPos.bottomRight.translate(0, 0.5 * wallSize)
        });
        return {
            block: pos.bottom(),
            point: MazeBlockPoint.TOP_LEFT
        };
    } else if (left) {
        result.push({
            type: "line",
            pos1: cornerPos.topRight.translate(0, -0.5 * wallSize),
            pos2: cornerPos.topRight.clone()
        });
        result.push({
            type: "arc",
            center: cornerPos.topLeft.clone(),
            radius: wallSize,
            start: 0,
            end: 0.5 * Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.bottomLeft.clone(),
            pos2: cornerPos.bottomLeft.translate(-0.5 * wallSize, 0)
        });
        return {
            block: pos.bottom().left(),
            point: MazeBlockPoint.TOP_RIGHT
        };
    } else {
        result.push({
            type: "line",
            pos1: cornerPos.topRight.translate(0, -0.5 * wallSize),
            pos2: cornerPos.topRight.translate(0, 0.5 * wallSize)
        });
        result.push({
            type: "arc",
            center: cornerPos.topLeft.translate(0.5 * wallSize, 0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: 0,
            end: Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.topLeft.translate(0, 0.5 * wallSize),
            pos2: cornerPos.topLeft.translate(0, -0.5 * wallSize)
        });
        return {
            block: pos.left(),
            point:  MazeBlockPoint.BOTTOM_RIGHT
        };
    }
}

function strokeSegmentFromBottomLeft(
    maze: Maze,
    canvasInfo: CanvasInfo,
    mazePos: MazeSegmentTracer,
    result: Segment[]
): MazeSegmentTracer {
    const { blockSize, wallSize } = canvasInfo;
    const { block: pos } = mazePos;

    let { top, bottom, right } = getGridPointWalls(maze, pos.bottom().right());
    let cornerPos = getGridPointCornerPos(canvasInfo, pos.bottom().right());

    result.push({
        type: "line",
        pos1: cornerPos.topLeft.translate(-blockSize + 0.5 * wallSize, 0),
        pos2: cornerPos.topLeft.translate(-0.5 * wallSize, 0)
    });

    if (top) {
        result.push({
            type: "arc",
            center: cornerPos.topLeft.translate(-0.5 * wallSize, -0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: 0.5 * Math.PI,
            end: 0,
            counterClockWise: true
        });
        return {
            block: pos.clone(),
            point: MazeBlockPoint.BOTTOM_RIGHT
        };
    } else if (right) {
        result.push({
            type: "line",
            pos1: cornerPos.topLeft.translate(-0.5 * wallSize, 0),
            pos2: cornerPos.topRight.translate(0.5 * wallSize, 0)
        });
        return {
            block: pos.right(),
            point: MazeBlockPoint.BOTTOM_LEFT
        };
    } else if (bottom) {
        result.push({
            type: "line",
            pos1: cornerPos.topLeft.translate(-0.5 * wallSize, 0),
            pos2: cornerPos.topLeft.clone()
        });
        result.push({
            type: "arc",
            center: cornerPos.bottomLeft.clone(),
            radius: wallSize,
            start: 1.5 * Math.PI,
            end: 2 * Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.bottomRight.clone(),
            pos2: cornerPos.bottomRight.translate(0, 0.5 * wallSize)
        });
        return {
            block: pos.right().bottom(),
            point: MazeBlockPoint.TOP_LEFT
        };
    } else {
        result.push({
            type: "line",
            pos1: cornerPos.topLeft.translate(-0.5 * wallSize, 0),
            pos2: cornerPos.topLeft.clone()
        });
        result.push({
            type: "arc",
            center: cornerPos.topLeft.translate(0.5 * wallSize, 0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: 1.5 * Math.PI,
            end: 2.5 * Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.bottomLeft.clone(),
            pos2: cornerPos.bottomLeft.translate(-0.5 * wallSize, 0)
        });
        return {
            block: pos.bottom(),
            point: MazeBlockPoint.TOP_RIGHT
        };
    }
}

function strokeSegmentFromBottomRight(
    maze: Maze,
    canvasInfo: CanvasInfo,
    mazePos: MazeSegmentTracer,
    result: Segment[]
): MazeSegmentTracer {
    const { blockSize, wallSize } = canvasInfo;
    const { block: pos } = mazePos;

    let { top, left, right } = getGridPointWalls(maze, pos.right());
    let cornerPos = getGridPointCornerPos(canvasInfo, pos.right());

    result.push({
        type: "line",
        pos1: cornerPos.bottomLeft.translate(0, blockSize - 0.5 * wallSize),
        pos2: cornerPos.bottomLeft.translate(0, 0.5 * wallSize)
    });

    if (left) {
        result.push({
            type: "arc",
            center: cornerPos.bottomLeft.translate(-0.5 * wallSize, 0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: 2 * Math.PI,
            end: 1.5 * Math.PI,
            counterClockWise: true
        });
        return {
            block: pos.clone(),
            point: MazeBlockPoint.TOP_RIGHT
        };
    } else if (top) {
        result.push({
            type: "line",
            pos1: cornerPos.bottomLeft.translate(0, 0.5 * wallSize),
            pos2: cornerPos.topLeft.translate(0, -0.5 * wallSize)
        });
        return {
            block: pos.top(),
            point: MazeBlockPoint.BOTTOM_RIGHT
        };
    } else if (right) {
        result.push({
            type: "line",
            pos1: cornerPos.bottomLeft.translate(0, 0.5 * wallSize),
            pos2: cornerPos.bottomLeft.clone()
        });
        result.push({
            type: "arc",
            center: cornerPos.bottomRight.clone(),
            radius: wallSize,
            start: Math.PI,
            end: 1.5 * Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.topRight.clone(),
            pos2: cornerPos.topRight.translate(0.5 * wallSize, 0)
        });
        return {
            block: pos.top().right(),
            point: MazeBlockPoint.BOTTOM_LEFT
        };
    } else {
        result.push({
            type: "line",
            pos1: cornerPos.bottomLeft.translate(0, 0.5 * wallSize),
            pos2: cornerPos.bottomLeft.translate(0, -0.5 * wallSize)
        });
        result.push({
            type: "arc",
            center: cornerPos.topLeft.translate(0.5 * wallSize, 0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: Math.PI,
            end: 2 * Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.bottomRight.translate(0, -0.5 * wallSize),
            pos2: cornerPos.bottomRight.translate(0, 0.5 * wallSize)
        });
        return {
            block: pos.right(),
            point: MazeBlockPoint.TOP_LEFT
        };
    }
}

function strokeSegmentFromTopRight(
    maze: Maze,
    canvasInfo: CanvasInfo,
    mazePos: MazeSegmentTracer,
    result: Segment[]
): MazeSegmentTracer {
    const { blockSize, wallSize } = canvasInfo;
    const { block: pos } = mazePos;

    let { top, left, bottom } = getGridPointWalls(maze, pos);
    let cornerPos = getGridPointCornerPos(canvasInfo, pos);

    result.push({
        type: "line",
        pos1: cornerPos.bottomRight.translate(blockSize - 0.5 * wallSize, 0),
        pos2: cornerPos.bottomRight.translate(0.5 * wallSize, 0)
    });

    if (bottom) {
        result.push({
            type: "arc",
            center: cornerPos.bottomRight.translate(0.5 * wallSize, 0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: 1.5 * Math.PI,
            end: Math.PI,
            counterClockWise: true
        });
        return {
            block: pos.clone(),
            point: MazeBlockPoint.TOP_LEFT
        };
    } else if (left) {
        result.push({
            type: "line",
            pos1: cornerPos.bottomRight.translate(0.5 * wallSize, 0),
            pos2: cornerPos.bottomLeft.translate(-0.5 * wallSize, 0)
        });
        return {
            block: pos.left(),
            point: MazeBlockPoint.TOP_RIGHT
        };
    } else if (top) {
        result.push({
            type: "line",
            pos1: cornerPos.bottomRight.translate(0.5 * wallSize, 0),
            pos2: cornerPos.bottomRight.clone()
        });
        result.push({
            type: "arc",
            center: cornerPos.topRight.clone(),
            radius: wallSize,
            start: 0.5 * Math.PI,
            end: Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.topLeft.clone(),
            pos2: cornerPos.topLeft.translate(0, -0.5 * wallSize)
        });
        return {
            block: pos.left().top(),
            point: MazeBlockPoint.BOTTOM_RIGHT
        };
    } else {
        result.push({
            type: "line",
            pos1: cornerPos.bottomRight.translate(0.5 * wallSize, 0),
            pos2: cornerPos.bottomRight.translate(-0.5 * wallSize, 0)
        });
        result.push({
            type: "arc",
            center: cornerPos.topLeft.translate(0.5 * wallSize, 0.5 * wallSize),
            radius: 0.5 * wallSize,
            start: 0.5 * Math.PI,
            end: 1.5 * Math.PI,
            counterClockWise: false
        });
        result.push({
            type: "line",
            pos1: cornerPos.topRight.translate(-0.5 * wallSize, 0),
            pos2: cornerPos.topRight.translate(0.5 * wallSize, 0)
        });
        return {
            block: pos.top(),
            point: MazeBlockPoint.BOTTOM_LEFT
        };
    }
}

function calculateSegment(
    maze: Maze,
    canvasInfo: CanvasInfo,
    pos: MazeSegmentTracer,
    result: Segment[]
): MazeSegmentTracer {
    switch (pos.point) {
        case MazeBlockPoint.TOP_LEFT:
            return strokeSegmentFromTopLeft(maze, canvasInfo, pos, result);
        case MazeBlockPoint.BOTTOM_LEFT:
            return strokeSegmentFromBottomLeft(maze, canvasInfo, pos, result);
        case MazeBlockPoint.BOTTOM_RIGHT:
            return strokeSegmentFromBottomRight(maze, canvasInfo, pos, result);
        case MazeBlockPoint.TOP_RIGHT:
            return strokeSegmentFromTopRight(maze, canvasInfo, pos, result);
    }
}

function margeLines(segments: Segment[]) {
    let lastLine: Segment & { type: "line" } | null = null;
    for (let i = 0, segment = segments[i]; i < segments.length; segment = segments[++i]) {
        if (lastLine === null) {
            if (segment.type === "line") {
                lastLine = segment;
            }
        } else if (segment.type === "line") {
            lastLine.pos2 = segment.pos2;
            segments.splice(i, 1);
            i--;
        } else {
            lastLine = null;
        }
    }
}

function buildMazeSegment(maze: Maze, canvasInfo: CanvasInfo): Segment[] {
    const beginPos: MazeSegmentTracer = {
        block: new BlockPosition(0, 0),
        point: MazeBlockPoint.TOP_LEFT
    };
    let pos: MazeSegmentTracer = {
        block: new BlockPosition(0, 0),
        point: MazeBlockPoint.TOP_LEFT
    };
    let result: Segment[] = [];

    while (true) {
        pos = calculateSegment(maze, canvasInfo, pos, result);
        if (pos.block.equal(beginPos.block) && pos.point === beginPos.point) break;
    }

    margeLines(result);

    return result;
}

export { buildMazeSegment, MazeBlockPoint };
export type { MazeSegmentTracer, Segment };

