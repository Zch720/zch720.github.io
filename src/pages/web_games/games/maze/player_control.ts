import { checkPlayerCollision } from "./collision_handle";
import { KeyMap, type Player } from "./game_control";
import type { Segment } from "./maze_segment";

function updatePlayerPos(
    player: Player,
    segments: Segment[],
    keyPress: Map<KeyMap, boolean>,
    deltaTime: number
) {
    let moveX = 0;
    let moveY = 0;

    if (keyPress.get(KeyMap.W) || keyPress.get(KeyMap.UP)) {
        moveY -= player.moveSpeed * deltaTime;
    }
    if (keyPress.get(KeyMap.A) || keyPress.get(KeyMap.LEFT)) {
        moveX -= player.moveSpeed * deltaTime;
    }
    if (keyPress.get(KeyMap.S) || keyPress.get(KeyMap.DOWN)) {
        moveY += player.moveSpeed * deltaTime;
    }
    if (keyPress.get(KeyMap.D) || keyPress.get(KeyMap.RIGHT)) {
        moveX += player.moveSpeed * deltaTime;
    }

    player.moveX(moveX);
    if (checkPlayerCollision(player, segments)) {
        player.moveX(-moveX);
    }
    player.moveY(moveY);
    if (checkPlayerCollision(player, segments)) {
        player.moveY(-moveY);
    }
}

export { updatePlayerPos };

