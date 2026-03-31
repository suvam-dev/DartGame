export default function score(dartx, darty) {
    console.log("dartx:" + dartx, "darty:" + darty);
    const dx = dartx - centerX;
    const dy = darty - centerY;

    distance = Math.sqrt(dx * dx + dy * dy);
    r = distance / boardRadius;
    if (r > 1) {
        return 0;
    }
    if (r < 0.1) {
        return 50;
    }
    if (r < 0.2) {
        return 25;
    }
    angle = atan2(dy / dx);
    angle = angle * 180 / Math.PI;
    if (angle < 0) {
        angle += 360;
    }
    console.log("angle:" + angle)
    console.log("distance:" + distance);
}