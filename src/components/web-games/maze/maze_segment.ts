import type { Block, DrawerInfo, GridPointPosition, MazeSegmentTracer, Segment } from "./type_define";
import { DefaultMazeSegmentTracer, Direction, GridPoint, Maze, Position } from "./type_define";

class CornerPos {
    topLeft: Position;
    bottomLeft: Position;
    bottomRight: Position;
    topRight: Position;
    
    constructor(topLeft: Position, bottomLeft: Position, bottomRight: Position, topRight: Position) {
        this.topLeft = topLeft;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
        this.topRight = topRight;
    }

    getCorner(point: GridPoint): Position {
        switch (point) {
            case GridPoint.TOP_LEFT:
                return this.topLeft;
            case GridPoint.TOP_RIGHT:
                return this.topRight;
            case GridPoint.BOTTOM_LEFT:
                return this.bottomLeft;
            case GridPoint.BOTTOM_RIGHT:
                return this.bottomRight;
        }
    }
}

class GridPointWalls {
    top: boolean;
    left: boolean;
    bottom: boolean;
    right: boolean;
    
    constructor(top: boolean, left: boolean, bottom: boolean, right: boolean) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
    }

    hasWall(direction: Direction): boolean {
        switch (direction) {
            case Direction.TOP:
                return this.top;
            case Direction.LEFT:
                return this.left;
            case Direction.BOTTOM:
                return this.bottom;
            case Direction.RIGHT:
                return this.right;
        }
    }
}

/**
 * Convert a grid point to a direction. It will be convert to direction that is rotate 45 degrees clockwise.
 * @param point The grid point to convert
 * @returns The corresponding direction
 */
function toDirection(
    point: GridPoint
): Direction {
    return point as unknown as Direction;
}

function RotatePoint(
    point: GridPoint,
    times: number
): GridPoint {
    return (point + times) % 4;
}

function RotateDirection(
    direction: Direction,
    times: number
): Direction {
    return (direction + times) % 4;
}

function getBlockGridPoint(
    block: Block,
    point: GridPoint
): Block {
    switch (point) {
        case GridPoint.TOP_LEFT:
            return block.clone();
        case GridPoint.BOTTOM_LEFT:
            return block.bottom();
        case GridPoint.BOTTOM_RIGHT:
            return block.bottom().right();
        case GridPoint.TOP_RIGHT:
            return block.right();
    }
}

function getCornerCalcBase(
    point: GridPoint
): Position {
    switch (point) {
        case GridPoint.TOP_LEFT:
            return new Position(-1, -1);
        case GridPoint.TOP_RIGHT:
            return new Position(1, -1);
        case GridPoint.BOTTOM_LEFT:
            return new Position(-1, 1);
        case GridPoint.BOTTOM_RIGHT:
            return new Position(1, 1);
    }
}

function getBlock(
    block: Block,
    direction: Direction
): Block {
    switch (direction) {
        case Direction.TOP:
            return block.top();
        case Direction.LEFT:
            return block.left();
        case Direction.BOTTOM:
            return block.bottom();
        case Direction.RIGHT:
            return block.right();
    }
}

function getRadianFromDirection(direction: Direction): number {
    switch (direction) {
        case Direction.RIGHT:
            return 0;
        case Direction.BOTTOM:
            return 0.5 * Math.PI;
        case Direction.LEFT:
            return Math.PI;
        case Direction.TOP:
            return 1.5 * Math.PI;
    }
}

function getGridPointWalls(
    maze: Maze,
    pos: GridPointPosition
): GridPointWalls {
    return new GridPointWalls(
        pos.row !== 0 && (pos.col == maze.size.cols || maze.hasWall(pos.top(), Direction.LEFT)),
        pos.col !== 0 && (pos.row == maze.size.rows || maze.hasWall(pos.left(), Direction.TOP)),
        pos.row !== maze.size.rows && (pos.col == maze.size.cols || maze.hasWall(pos, Direction.LEFT)),
        pos.col !== maze.size.cols && (pos.row == maze.size.rows || maze.hasWall(pos, Direction.TOP))
    );
}

function getGridPointCornerPos(
    drawerInfo: DrawerInfo,
    pos: GridPointPosition
): CornerPos {
    const { unitSize, wallSize } = drawerInfo;
    return new CornerPos(
        new Position(pos.col * unitSize, pos.row * unitSize),
        new Position(pos.col * unitSize, pos.row * unitSize + wallSize),
        new Position(pos.col * unitSize + wallSize, pos.row * unitSize + wallSize),
        new Position(pos.col * unitSize + wallSize, pos.row * unitSize)
    );
}

function strokeLine(
    result: Segment[],
    pos1: Position,
    pos2: Position
) {
    result.push({
        type: "line",
        pos1,
        pos2
    });
}

function strokeArc(
    result: Segment[],
    center: Position,
    radius: number,
    start: number,
    end: number,
    counterClockWise: boolean = false
) {
    result.push({
        type: "arc",
        center,
        radius,
        start,
        end,
        counterClockWise
    });
}

function strokeBlockEdge(
    result: Segment[],
    drawerInfo: DrawerInfo,
    tracer: MazeSegmentTracer,
    corners: CornerPos
) {
    const { blockSize, wallSize } = drawerInfo;
    const temp = getCornerCalcBase(RotatePoint(tracer.point, 3))
                    .sub(getCornerCalcBase(RotatePoint(tracer.point, 2)))
                    .mul(0.5);
    strokeLine(result,
        corners.getCorner(RotatePoint(tracer.point, 3)).translatePosition(temp.mul(blockSize - 0.5 * wallSize)),
        corners.getCorner(RotatePoint(tracer.point, 3)).translatePosition(temp.mul(0.5 * wallSize))
    );
}

function strokeInnerCorner(
    result: Segment[],
    drawerInfo: DrawerInfo,
    tracer: MazeSegmentTracer,
    corners: CornerPos
): MazeSegmentTracer {
    const { wallSize } = drawerInfo;
    const center = corners
                        .getCorner(RotatePoint(tracer.point, 3))
                        .translatePosition(
                            getCornerCalcBase(RotatePoint(tracer.point, 3))
                                .mul(0.5 * wallSize)
                        );
    const start = getRadianFromDirection(RotateDirection(toDirection(tracer.point), 1));
    strokeArc(result, center, 0.5 * wallSize, start, start - 0.5 * Math.PI, true);
    return {
        block: tracer.block,
        point: RotatePoint(tracer.point, 1)
    }
}

function strokeForwardLine(
    result: Segment[],
    drawerInfo: DrawerInfo,
    tracer: MazeSegmentTracer,
    corners: CornerPos
): MazeSegmentTracer {
    const { wallSize } = drawerInfo;
    const temp = getCornerCalcBase(RotatePoint(tracer.point, 1))
                    .sub(getCornerCalcBase(RotatePoint(tracer.point, 2)))
                    .mul(0.5);
    strokeLine(result,
        corners.getCorner(RotatePoint(tracer.point, 1)).add(temp.mul(0.5 * wallSize)),
        corners.getCorner(RotatePoint(tracer.point, 2)).add(temp.mul(-0.5 * wallSize))
    );
    return {
        block: getBlock(tracer.block, RotateDirection(toDirection(tracer.point), 2)),
        point: tracer.point
    };
}

function strokeOuterCorner(
    result: Segment[],
    drawerInfo: DrawerInfo,
    tracer: MazeSegmentTracer,
    corners: CornerPos
): MazeSegmentTracer {
    const { wallSize } = drawerInfo;

    let temp = getCornerCalcBase(RotatePoint(tracer.point, 3))
                .sub(getCornerCalcBase(RotatePoint(tracer.point, 2)))
                .mul(0.5);
    strokeLine(result,
        corners.getCorner(RotatePoint(tracer.point, 3)).translatePosition(temp.mul(0.5 * wallSize)),
        corners.getCorner(RotatePoint(tracer.point, 3)).clone()
    );
    let startRadian = getRadianFromDirection(RotateDirection(toDirection(tracer.point), 3));
    strokeArc(result,
        corners.getCorner(tracer.point).clone(),
        wallSize,
        startRadian, startRadian + 0.5 * Math.PI
    );
    temp = getCornerCalcBase(RotatePoint(tracer.point, 2))
            .sub(getCornerCalcBase(RotatePoint(tracer.point, 1)))
            .mul(0.5);
    strokeLine(result,
        corners.getCorner(RotatePoint(tracer.point, 1)).clone(),
        corners.getCorner(RotatePoint(tracer.point, 1)).translatePosition(temp.mul(0.5 * wallSize))
    );
    return {
        block: getBlock(
            getBlock(tracer.block, RotateDirection(toDirection(tracer.point), 1)),
            RotateDirection(toDirection(tracer.point), 2)
        ),
        point: RotatePoint(tracer.point, 3)
    };
}

function strokeUTurn(
    result: Segment[],
    drawerInfo: DrawerInfo,
    tracer: MazeSegmentTracer,
    corners: CornerPos
): MazeSegmentTracer {
    const { wallSize } = drawerInfo;
    
    let temp = getCornerCalcBase(RotatePoint(tracer.point, 3))
                .sub(getCornerCalcBase(RotatePoint(tracer.point, 2)))
                .mul(0.5);
    strokeLine(result,
        corners.getCorner(RotatePoint(tracer.point, 3)).translatePosition(temp.mul(0.5 * wallSize)),
        corners.getCorner(RotatePoint(tracer.point, 3)).translatePosition(temp.mul(-0.5 * wallSize))
    );
    let startRadian = getRadianFromDirection(RotateDirection(toDirection(tracer.point), 3));
    strokeArc(result,
        corners.topLeft.translateXY(0.5 * wallSize, 0.5 * wallSize),
        0.5 * wallSize,
        startRadian, startRadian + Math.PI
    );
    strokeLine(result,
        corners.getCorner(tracer.point).translatePosition(temp.mul(-0.5 * wallSize)),
        corners.getCorner(tracer.point).translatePosition(temp.mul(0.5 * wallSize))
    );
    return {
        block: getBlock(tracer.block, RotateDirection(toDirection(tracer.point), 1)),
        point: RotatePoint(tracer.point, 2)
    };
}

function calcSegment(
    maze: Maze,
    drawerInfo: DrawerInfo,
    tracer: MazeSegmentTracer,
    result: Segment[]
): MazeSegmentTracer {
    const cornerGridPoint = getBlock(
        getBlockGridPoint(tracer.block, tracer.point),
        (tracer.point + 2) % 4
    );
    const walls = getGridPointWalls(maze, cornerGridPoint);
    const cornerPos = getGridPointCornerPos(drawerInfo, cornerGridPoint);

    strokeBlockEdge(result, drawerInfo, tracer, cornerPos);
    if (walls.hasWall((tracer.point + 3) % 4)) {
        return strokeInnerCorner(result, drawerInfo, tracer, cornerPos);
    } else if (walls.hasWall((tracer.point + 2) % 4)) {
        return strokeForwardLine(result, drawerInfo, tracer, cornerPos);
    } else if (walls.hasWall((tracer.point + 1) % 4)) {
        return strokeOuterCorner(result, drawerInfo, tracer, cornerPos);
    } else {
        return strokeUTurn(result, drawerInfo, tracer, cornerPos);
    }
}

function margeLines(
    segments: Segment[]
) {
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

export function getMazeSegments(
    maze: Maze,
    drawerInfo: DrawerInfo
): Segment[] {
    let tracer = DefaultMazeSegmentTracer;
    let result: Segment[] = [];
    while (true) {
        tracer = calcSegment(maze, drawerInfo, tracer, result);
        if (
            tracer.block.equals(DefaultMazeSegmentTracer.block) && 
            tracer.point === DefaultMazeSegmentTracer.point
        ) {
            break;
        }
    }

    margeLines(result);
    return result;
}
