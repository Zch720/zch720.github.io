import type { DrawerInfo, MazeSize, Player, Segment, Size } from "./type_define";

export function calcDrawerInfo(
    maxViewSize: Size,
    mazeSize: MazeSize
): DrawerInfo {
    // blockSize:wallSize = 3:1
    const unitWidth = Math.floor(maxViewSize.width / (mazeSize.cols * 4 + 1));
    const unitHeight = Math.floor(maxViewSize.height / (mazeSize.rows * 4 + 1));
    const unitSize = Math.min(unitWidth, unitHeight);
    return {
        canvasSize: {
            width: unitSize * (mazeSize.cols * 4 + 1),
            height: unitSize * (mazeSize.rows * 4 + 1)
        },
        blockSize: 3 * unitSize,
        wallSize: unitSize,
        unitSize: 4 * unitSize
    };
}

export function clearMazeCanvas(
    ctx: CanvasRenderingContext2D,
    drawerInfo: DrawerInfo
) {
    ctx.reset();
    ctx.roundRect(0, 0, drawerInfo.canvasSize.width, drawerInfo.canvasSize.height, drawerInfo.wallSize);
    ctx.fillStyle = "black";
    ctx.fill();
}

export function clearPlayerCanvas(
    ctx: CanvasRenderingContext2D
) {
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

export function drawMaze(
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
        } else {
            drawArc(ctx, segment);
        }
    });
    ctx.fillStyle = "white";
    ctx.fill();
}

export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: Player
) {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}
