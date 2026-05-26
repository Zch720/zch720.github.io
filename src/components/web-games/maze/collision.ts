import { Position, type Player, type Segment } from "./type_define";

function checkLineCollision(
    player: Player,
    segment: Segment & { type: "line" }
): boolean {
    if (segment.pos1.x === segment.pos2.x) {
        let top = new Position(segment.pos1.x, Math.min(segment.pos1.y, segment.pos2.y));
        let bottom = new Position(segment.pos1.x, Math.max(segment.pos1.y, segment.pos2.y));
        if (player.position.y < top.y) {
            return player.position.distance(top) < player.radius;
        }
        if (bottom.y < player.position.y) {
            return player.position.distance(bottom) < player.radius;
        }
        return Math.abs(player.position.x - segment.pos1.x) < player.radius;
    }
    if (segment.pos1.y === segment.pos2.y) {
        let left = new Position(Math.min(segment.pos1.x, segment.pos2.x), segment.pos1.y);
        let right = new Position(Math.max(segment.pos1.x, segment.pos2.x), segment.pos1.y);
        if (player.position.x < left.x) {
            return player.position.distance(left) < player.radius;
        }
        if (right.x < player.position.x) {
            return player.position.distance(right) < player.radius;
        }
        return Math.abs(player.position.y - segment.pos1.y) < player.radius;
    }
    return false;
}

function checkArcCollision(
    player: Player,
    segment: Segment & { type: "arc" }
): boolean {
    if (!segment.counterClockWise) {
        const deltaX = player.position.x - segment.center.x;
        const deltaY = player.position.y - segment.center.y;
        let angle = Math.atan2(deltaY, deltaX);
        if (angle < segment.start) angle += 2 * Math.PI;
        if (angle < segment.start || segment.end < angle) return false;

        return player.position.distance(segment.center) < player.radius + segment.radius;
    }
    return false;
}

export function checkCollision(
    player: Player,
    segments: Segment[]
): boolean {
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