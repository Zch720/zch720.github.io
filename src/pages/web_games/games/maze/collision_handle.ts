import { type Player } from "./game_control";
import type { Segment } from "./maze_segment";
import { Position } from "./types";

function checkLineCollision(player: Player, segment: Segment & { type: "line" }): boolean {
    if (segment.pos1.x === segment.pos2.x) {
        let top = new Position(segment.pos1.x, Math.min(segment.pos1.y, segment.pos2.y));
        let bottom = new Position(segment.pos1.x, Math.max(segment.pos1.y, segment.pos2.y));
        if (player.pos.y < top.y) {
            return player.pos.distance(top) < player.radius;
        }
        if (bottom.y < player.pos.y) {
            return player.pos.distance(bottom) < player.radius;
        }
        return Math.abs(player.pos.x - segment.pos1.x) < player.radius;
    }
    if (segment.pos1.y === segment.pos2.y) {
        let left = new Position(Math.min(segment.pos1.x, segment.pos2.x), segment.pos1.y);
        let right = new Position(Math.max(segment.pos1.x, segment.pos2.x), segment.pos1.y);
        if (player.pos.x < left.x) {
            return player.pos.distance(left) < player.radius;
        }
        if (right.x < player.pos.x) {
            return player.pos.distance(right) < player.radius;
        }
        return Math.abs(player.pos.y - segment.pos1.y) < player.radius;
    }
    return false;
}

function checkArcCollision(player: Player, segment: Segment & { type: "arc" }): boolean {
    if (!segment.counterClockWise) {
        const deltaX = player.pos.x - segment.center.x;
        const deltaY = player.pos.y - segment.center.y;
        let angle = Math.atan2(deltaY, deltaX);
        if (angle < segment.start) angle += 2 * Math.PI;
        if (angle < segment.start || segment.end < angle) return false;

        return player.pos.distance(segment.center) < player.radius + segment.radius;
    }
    return false;
}

function checkPlayerCollision(player: Player, segments: Segment[]): boolean {
    let result = false;
    segments.forEach((segment) => {
        if (result) return;
        if (segment.type === "line") {
            result = result || checkLineCollision(player, segment);
        }
        if (segment.type === "arc") {
            result = result || checkArcCollision(player, segment);
        }
        // if (result) console.log(segment);
    });
    return result;
}

export { checkPlayerCollision };

