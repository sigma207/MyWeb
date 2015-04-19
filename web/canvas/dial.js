/**
 * Created by user on 2015/4/14.
 */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = "rgba(0,0,0,0.5)",
    CENTROID_FILL_STYLE = "rgba(80,190,240,0.6)",

    RING_INNER_RADIUS = 35,
    RING_OUTER_RADIUS = 55,

    ANNOTATIONS_FILL_STYLE = "rgba(0,0,230,0.9)",
    ANNOTATIONS_TEXT_SIZE = 12,

    TICK_WIDTH = 10,
    TICK_LONG_STROKE_STYLE = "rgba(100,140,230,0.9)",
    TICK_SHORT_STROKE_STYLE = "rgba(100,140,230,0.7)",

    TRACKING_DIAL_STROKE_STYLE = "rgba(100,140,230,0.5)",

    GUIDE_WIRE_STROKE_STYLE = "goldenrod",
    GUIDE_WIRE_FILL_STYLE = "rgba(250,250,0,0.6)",

    circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 150
    };

ctx.shadowColor = "rgba(0,0,0,0.4)";
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.shadowBlur = 4;

ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.drawGrid("lightgray", 10, 10);
drawDial();
function drawDial() {
    var loc = {x: circle.x, y: circle.y};
    drawCentroid();
    drawCentroidGuideWire(loc);
    drawRing();
    drawTickInnerCircle();
    drawTicks();
    drawAnnotations();
}
function drawCentroid() {
    ctx.save();
    ctx.strokeStyle = CENTROID_STROKE_STYLE;
    ctx.fillStyle = CENTROID_FILL_STYLE;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}
function drawCentroidGuideWire(loc) {
    var angle = -Math.PI / 4, radius, endpt;
    radius = circle.radius + RING_OUTER_RADIUS;
    if (loc.x > circle.x) {
        endpt = {
            x: circle.x + radius * Math.cos(angle),
            y: circle.y + radius * Math.sin(angle)
        }
    } else {
        endpt = {
            x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        }
    }
    ctx.save();
    ctx.strokeStyle = GUIDE_WIRE_STROKE_STYLE;
    ctx.fillStyle = GUIDE_WIRE_FILL_STYLE;

    ctx.beginPath();
    ctx.moveTo(circle.x, circle.y);
    ctx.lineTo(endpt.x, endpt.y);
    ctx.stroke();

    ctx.strokeStyle = TICK_LONG_STROKE_STYLE;
    ctx.beginPath();
    ctx.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}
function drawRing() {
    drawRingOuterCircle();
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.fillStyle = "rgba(100,140,230,0.1)";
    ctx.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
}
function drawRingOuterCircle() {
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 6;
    ctx.strokeStyle = TRACKING_DIAL_STROKE_STYLE;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius + RING_OUTER_RADIUS, 0, Math.PI * 2, true);
    ctx.stroke();
}
function drawTickInnerCircle() {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.restore();
}
function drawTick(angle, radius, cnt) {
    //console.log("cnt=" + cnt + ",angle=" + angle);
    var tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
    ctx.strokeStyle = TICK_SHORT_STROKE_STYLE;
    ctx.beginPath();
    ctx.moveTo(circle.x + Math.cos(angle) * (radius), circle.y + Math.sin(angle) * (radius));
    ctx.lineTo(circle.x + Math.cos(angle) * (radius - tickWidth), circle.y + Math.sin(angle) * (radius - tickWidth));
    ctx.stroke();
}
function drawTicks() {
    var radius = circle.radius + RING_INNER_RADIUS,
        ANGLE_MAX = Math.PI * 2,
        ANGLE_DELTA = Math.PI / 64,
        tickWidth;
    ctx.save();
    for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
        drawTick(angle, radius, cnt++);
    }
    ctx.restore();
}
function drawAnnotations() {
    var radius = circle.radius + RING_INNER_RADIUS,
        ANGLE_MAX = Math.PI * 2,
        ANGLE_DELTA = Math.PI / 8;
    ctx.save();
    ctx.fillStyle = ANNOTATIONS_FILL_STYLE;
    ctx.font = ANNOTATIONS_TEXT_SIZE + "px Helvetica";
    for (var angle = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA) {
        ctx.beginPath();
        ctx.fillText((angle * 180 / Math.PI).toFixed(0),
            circle.x + Math.cos(angle) * (radius - TICK_WIDTH * 2),
            circle.y - Math.sin(angle) * (radius - TICK_WIDTH * 2));
    }
    ctx.restore();
}