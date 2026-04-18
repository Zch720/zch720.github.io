import { type Player } from "./game_control";
import { type Segment } from "./maze_segment";

interface CanvasInfo {
    width: number,
    height: number,
    wallSize: number,
    blockSize: number,
    unitSize: number
}

function calculateCanvasSize(
    maxVw: number,
    maxVh: number,
    mazeSize: {
        cols: number,
        rows: number
    }
): CanvasInfo {
    // blockSize:wallSize = 3:1
    const unitWidth = Math.floor(maxVw / (mazeSize.cols * 4 + 1));
    const unitHeight = Math.floor(maxVh / (mazeSize.rows * 4 + 1));
    const unitSize = Math.min(unitWidth, unitHeight);
    return {
        width: unitSize * (mazeSize.cols * 4 + 1),
        height: unitSize * (mazeSize.rows * 4 + 1),
        wallSize: unitSize,
        blockSize: 3 * unitSize,
        unitSize: 4 * unitSize
    };
}

function clearMazeCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    canvasInfo: CanvasInfo
) {
    ctx.reset();
    ctx.roundRect(0, 0, canvas.width, canvas.height, canvasInfo.wallSize);
    ctx.fillStyle = "black";
    ctx.fill();
}

function clearPlayerCanvas(ctx: CanvasRenderingContext2D) {
    ctx.reset();
}

function drawLine(
    ctx: CanvasRenderingContext2D,
    segment: Segment & { type: "line" }
) {
    ctx.lineTo(segment.pos2.x, segment.pos2.y);
}

function drawArc(
    ctx: CanvasRenderingContext2D,
    segment: Segment & { type: "arc" }
) {
    ctx.arc(
        segment.center.x, segment.center.y,
        segment.radius,
        segment.start, segment.end, segment.counterClockWise
    );
}

function drawMaze(
    ctx: CanvasRenderingContext2D,
    segments: Segment[]
) {
    ctx.beginPath();
    if (segments[0].type === "line") {
        ctx.moveTo(segments[0].pos1.x, segments[0].pos1.y);
    }
    segments.forEach((segment) => {
        if (segment.type === "line") {
            drawLine(ctx, segment);
        }
        if (segment.type === "arc") {
            drawArc(ctx, segment);
        }
    });
    
    ctx.fillStyle = "white";
    ctx.fill()
}

function drawPlayer (ctx: CanvasRenderingContext2D, player: Player) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.radius, 0, 2 * Math.PI);
    ctx.fill();
}

export {
    calculateCanvasSize, clearMazeCanvas, clearPlayerCanvas, drawMaze, drawPlayer
};
export type {
    CanvasInfo
};

