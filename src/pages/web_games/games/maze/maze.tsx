import { NumberField } from "@base-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { calculateCanvasSize, clearMazeCanvas, clearPlayerCanvas, drawMaze, drawPlayer, type CanvasInfo } from "./canvas_drawer";
import { defaultMoveKeys, defaultPlayer, emptyPlayer, generateMaze, type Maze, type Player } from "./game_control";
import { buildMazeSegment, type Segment } from "./maze_segment";
import { updatePlayerPos } from "./player_control";

function MazeGame() {
    const [maxVw, setMaxVw] = useState(Math.min(Math.max(Math.floor((window.innerWidth * 70) / 100), 1344), window.innerWidth));
    const [maxVh, setMaxVh] = useState((window.innerHeight * 75) / 100);
    const [canvasInfo, setCanvasInfo] = useState<CanvasInfo | null>(null);
    const [mazeSize, setMazeSize] = useState<{ cols: number, rows: number }>({ cols: 5, rows: 5 });
    const mazeCanvasRef = useRef<HTMLCanvasElement>(null);
    const playerCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationRequestRef = useRef<number>(0);
    const lastAnimationTime = useRef<number>(0);
    const maze = useRef<Maze>(null);
    const segments = useRef<Segment[]>([]);
    const canvasInfoRef = useRef<CanvasInfo>(canvasInfo);
    const player = useRef<Player>(emptyPlayer());
    const keyPress = useRef<Map<number, boolean>>(defaultMoveKeys());

    const drawMazeCanvas = () => {
        const canvas = mazeCanvasRef.current;
        if (!canvas) {
            console.log("canvas not found");
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("no context");
            return;
        }
        
        if (canvasInfo && maze.current) {
            clearMazeCanvas(ctx, canvas, canvasInfo);
            if (segments.current) {
                drawMaze(ctx, segments.current);
            }
        }
    };

    const playerCanvasPreFrame: FrameRequestCallback = (time) => {
        let deltaTime = 0;
        if (lastAnimationTime.current != 0) {
            deltaTime = (time - lastAnimationTime.current) / 1000;
        }
        lastAnimationTime.current = time;
        
        const canvas = playerCanvasRef.current;
        if (!canvas) {
            console.log("canvas not found");
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("no context");
            return;
        }

        clearPlayerCanvas(ctx);
        updatePlayerPos(player.current, segments.current, keyPress.current, deltaTime);
        drawPlayer(ctx, player.current);
        
        animationRequestRef.current = requestAnimationFrame(playerCanvasPreFrame);
    };

    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            keyPress.current.set(event.keyCode, true)
        });
        document.addEventListener('keyup', (event) => {
            keyPress.current.set(event.keyCode, false);
        });

        animationRequestRef.current = requestAnimationFrame(playerCanvasPreFrame);

        return () => cancelAnimationFrame(animationRequestRef.current);
    }, []);

    useEffect(() => {
        maze.current = generateMaze(mazeSize);
        setCanvasInfo(calculateCanvasSize(maxVw, maxVh, mazeSize));
    }, [mazeSize]);

    useEffect(() => {
        if (canvasInfo) {
            player.current = defaultPlayer(canvasInfo.wallSize, canvasInfo.blockSize);
            canvasInfoRef.current = canvasInfo;
            if (maze.current) {
                segments.current = buildMazeSegment(maze.current, canvasInfo);
            }
            drawMazeCanvas();
        }
    }, [canvasInfo]);

    return (
        <div style={{ "display": "flex", "flexDirection": "column" }}>
            <div style={{ "display": "flex", "flexDirection": "row", "justifyContent": "center", "gap": "1.5rem", margin: "0.5rem 0 1rem 0" }}>
                <NumberField.Root
                    className={"number-field"}
                    defaultValue={5}
                    min={1}
                    onValueChange={
                        (value) => {
                            setMazeSize({ ...mazeSize, cols: value ? value : 1 });
                        }
                    }
                >
                    <NumberField.ScrubArea className={"number-field-scrub-area"}>
                        Columns
                    </NumberField.ScrubArea>
                    <NumberField.Group className={"number-field-group"}>
                        <NumberField.Decrement className={"number-field-decrement"}>
                            <FaMinus />
                        </NumberField.Decrement>
                        <NumberField.Input className={"number-field-input"} />
                        <NumberField.Increment className={"number-field-increment"}>
                            <FaPlus />
                        </NumberField.Increment>
                    </NumberField.Group>
                </NumberField.Root>

                <NumberField.Root
                    className={"number-field"}
                    defaultValue={5}
                    min={1}
                    onValueChange={
                        (value) => {
                            setMazeSize({ ...mazeSize, rows: value ? value : 1 });
                        }
                    }
                >
                    <NumberField.ScrubArea className={"number-field-scrub-area"}>
                        Rows
                    </NumberField.ScrubArea>
                    <NumberField.Group className={"number-field-group"}>
                        <NumberField.Decrement className={"number-field-decrement"}>
                            <FaMinus />
                        </NumberField.Decrement>
                        <NumberField.Input className={"number-field-input"} />
                        <NumberField.Increment className={"number-field-increment"}>
                            <FaPlus />
                        </NumberField.Increment>
                    </NumberField.Group>
                </NumberField.Root>
            </div>
            <div
                style={{
                    "position": "relative",
                    "width": `${canvasInfo?.width}px`,
                    "height": `${canvasInfo?.height}px`,
                    "margin": "0 auto"
                }}
            >
                <canvas
                    ref={mazeCanvasRef}
                    width={canvasInfo?.width}
                    height={canvasInfo?.height}
                    style={{ "position": "absolute", "zIndex": 1 }}
                />
                <canvas
                    ref={playerCanvasRef}
                    width={canvasInfo?.width}
                    height={canvasInfo?.height}
                    style={{ "position": "absolute", "zIndex": 2 }}
                />
            </div>
        </div>
    );
}

export default MazeGame;
