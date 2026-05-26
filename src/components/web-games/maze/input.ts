import { Position } from "./type_define";

export class InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    getMoveVector(
    ): Position {
        return new Position(
            this.right ? 1 : this.left ? -1 : 0,
            this.down ? 1 : this.up ? -1 : 0
        );
    }
}

export function registerInput(inputState: InputState) {
    document.addEventListener("keydown", (e) => {
        if (e.key === "w") {
            inputState.up = true;
        }
        if (e.key === "s") {
            inputState.down = true;
        }
        if (e.key === "a") {
            inputState.left = true;
        }
        if (e.key === "d") {
            inputState.right = true;
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "w") {
            inputState.up = false;
        }
        if (e.key === "s") {
            inputState.down = false;
        }
        if (e.key === "a") {
            inputState.left = false;
        }
        if (e.key === "d") {
            inputState.right = false;
        }
    });
}
