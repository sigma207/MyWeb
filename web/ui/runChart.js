/**
 * Created by user on 2015/4/22.
 */
var chartArea = {};
var valueAxis = {};//成交價
var volumeAxis = {};//成交量
var info = {};
var canvas;
var ctx;
var drawData;
AXIS_MARGIN = 40;

//AXIS_WIDTH = 360;//60分*6=360
function chart(data) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    drawData = data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.dir(drawData);
    initChartArea();
    initVolumeAxis();
    initValueAxis();
    initInfo();
    //console.dir(axis);
    //console.dir(info);
    //console.dir(chartArea);
    drawValueAxis();
    drawVolumeAxis();
    drawHourText();
    drawValueText();
    drawVolumeText();
    drawValueDashLine();
    drawVolumeDashLine();
    drawValueLine();
    drawVolumeBar();
    drawInfo();
}


function initInfo() {
    info.minuteList = drawData.valueList;
    info.minuteScale = valueAxis.width / info.minuteList.length;
    info.hourDistance = 60;
    info.startHour = 9;

    info.valueMin = JsonTool.formatFloat(drawData.valueMin, 2);
    info.valueMax = JsonTool.formatFloat(drawData.valueMax, 2);
    info.valueMiddle = JsonTool.formatFloat(drawData.close, 2);
    info.valueDistance = JsonTool.formatFloat(info.valueMax - info.valueMin, 2);
    info.numTick = 10;
    info.tickDistance = JsonTool.formatFloat(info.valueDistance / info.numTick, 2);
    info.valueScale = valueAxis.height / info.valueDistance;
    info.valueTicks = function () {
        var temp = [];
        var top = this.valueMin;
        var i;
        for (i = 0; i < this.numTick / 2; i++) {
            temp.push(top);
            top = JsonTool.formatFloat(top + this.tickDistance, 2);
        }
        top = this.valueMiddle;
        for (i = 0; i < this.numTick / 2; i++) {
            temp.push(top);
            top = JsonTool.formatFloat(top + this.tickDistance, 2);
        }
        temp.push(this.valueMax);
        //console.dir(temp);
        return temp;
    };

    info.volumeMax = drawData.volumeMax;
    info.volumeMin = drawData.volumeMin;
    info.volumeDistance = info.volumeMax - info.volumeMin;
    info.volumeMiddle = info.volumeDistance / 2;
    info.volumeScale = volumeAxis.height / info.volumeDistance;
    info.volumeTicks = function () {
        return [0, this.volumeMiddle, this.volumeMax];
    };
    info.minuteTicks = function () {
        var temp = [];
        var count = this.minuteList.length;
        for (var i = 0; i <= count; i += this.hourDistance) {
            temp.push(i);
        }
        return temp;
    };
    //console.dir(info.valueTicks());
    //console.dir(info.minuteTicks());
}

function initChartArea() {
    chartArea.x = AXIS_MARGIN;
    chartArea.y = canvas.height - AXIS_MARGIN;
    chartArea.right = canvas.width - AXIS_MARGIN;
    chartArea.width = chartArea.right - chartArea.x;
    chartArea.top = AXIS_MARGIN;
    chartArea.height = chartArea.y - chartArea.top;
    chartArea.volumeHeight = chartArea.height / 5;
    chartArea.spaceHeight = chartArea.height / 20;
    chartArea.valueHeight = chartArea.height - chartArea.volumeHeight - chartArea.spaceHeight;

    chartArea.volumeY = chartArea.y;
    chartArea.valueY = chartArea.volumeY - chartArea.volumeHeight - chartArea.spaceHeight;
    //console.dir(chartArea);
}

function initValueAxis() {
    valueAxis.x = chartArea.x;
    valueAxis.y = chartArea.valueY;
    valueAxis.top = chartArea.top;
    valueAxis.right = chartArea.right;
    valueAxis.width = chartArea.width;
    valueAxis.height = chartArea.valueHeight;
    valueAxis.color = "black";
    valueAxis.lineWidth = 1.0;
    valueAxis.ticksWidth = 10;
    valueAxis.ticksColor = "red";
    valueAxis.ticksLineWidth = 0.5;
    valueAxis.horTicksSpacing = 10;
    valueAxis.verTicksSpacing = 10;
    valueAxis.numHorTicks = valueAxis.width / valueAxis.horTicksSpacing;
    valueAxis.numVerTicks = valueAxis.height / valueAxis.verTicksSpacing;
    //console.dir(valueAxis);
}

function initVolumeAxis() {
    volumeAxis.x = chartArea.x;
    volumeAxis.y = chartArea.volumeY;
    volumeAxis.top = chartArea.valueY;
    volumeAxis.right = chartArea.right;
    volumeAxis.width = chartArea.width;
    volumeAxis.height = chartArea.volumeHeight;
    volumeAxis.color = "black";
    volumeAxis.lineWidth = 1.0;
}

function drawValueAxis() {
    ctx.strokeStyle = valueAxis.color;
    ctx.lineWidth = valueAxis.lineWidth;
    drawHorizontalAxis(valueAxis.x, valueAxis.y, valueAxis.right);
    drawVerticalAxis(valueAxis.x, valueAxis.y, valueAxis.top);
}

function drawVolumeAxis() {
    ctx.strokeStyle = volumeAxis.color;
    ctx.lineWidth = volumeAxis.lineWidth;
    drawHorizontalAxis(volumeAxis.x, volumeAxis.y, volumeAxis.right);
    drawVerticalAxis(volumeAxis.x, volumeAxis.y, volumeAxis.top);
}

function drawHorizontalAxis(x, y, right) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(right, y);
    ctx.stroke();
}

function drawVerticalAxis(x, y, top) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, top);
    ctx.stroke();
}

function drawHourText() {
    var x = valueAxis.x;
    var y = chartArea.y + 10;
    var currentHour = info.startHour;
    var minuteList = info.minuteTicks();
    for (var i = 0; i < minuteList.length; i++) {
        ctx.fillText(currentHour.toString(), x + convertX(minuteList[i]), y);
        currentHour++;
    }
}

function drawValueText() {
    var x = valueAxis.x - 35;
    var y = valueAxis.y;
    var valueTickList = info.valueTicks();
    for (var i = 0; i < valueTickList.length; i++) {
        ctx.fillText(valueTickList[i], x, y - convertValueY(valueTickList[i]));
    }
}

function drawValueDashLine() {
    var y = valueAxis.y;
    var valueTickList = info.valueTicks();

    for (var i = 1; i < valueTickList.length; i++) {
        y = valueAxis.y - convertValueY(valueTickList[i]);
        drawDashLine(valueAxis.x,y,valueAxis.right,y,2);
    }
}

function drawVolumeDashLine(){
    var y = volumeAxis.y;
    var volumeTickList = info.volumeTicks();
    for (var i = 0; i < volumeTickList.length; i++) {
        y = volumeAxis.y - convertVolumeY(volumeTickList[i]);
        drawDashLine(volumeAxis.x,y,volumeAxis.right,y,2);
    }
}

function drawVolumeText() {
    var x = volumeAxis.x - 35;
    var y = volumeAxis.y;
    var volumeTickList = info.volumeTicks();
    for (var i = 0; i < volumeTickList.length; i++) {
        ctx.fillText(volumeTickList[i], x, y - convertVolumeY(volumeTickList[i]));
    }
}

function drawValueLine() {
    ctx.save();
    var data;
    var x = valueAxis.x;
    var y = valueAxis.y;
    var beforeX, beforeY;
    var tempY;
    for (var i = 0; i < drawData.valueList.length; i++) {
        beforeX = x;
        beforeY = y;
        data = drawData.valueList[i];
        tempY = convertValueY(data.value);
        //ctx.beginPath();
        //ctx.fillStyle = "red";
        x = valueAxis.x + convertX(i);
        y = valueAxis.y - convertValueY(data.value);
        //ctx.arc(x, y, 1, 0, Math.PI * 2, false);
        //ctx.fill();

        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(beforeX, beforeY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.restore();
}

function drawVolumeBar() {
    ctx.save();
    var data;
    var x = volumeAxis.x;
    var y = volumeAxis.y;
    for (var i = 0; i < drawData.valueList.length; i++) {
        data = drawData.valueList[i];
        x = volumeAxis.x + convertX(i);
        y = volumeAxis.y - convertVolumeY(data.volume);
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(x, volumeAxis.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.restore();
}

function drawInfo() {
    var x = 20;
    var y = 20;
    ctx.fillText(drawData.name, x, y);
}

function drawDashLine(x1, y1, x2, y2, dashLength) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));//2點之間的距離
    var numDash = Math.floor(distance / dashLength);//虛線和空白的數量
    var x;
    var y;
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (var i = 0; i < numDash; i++) {
        x = x1 + deltaX / numDash * i;
        y = y1 + deltaY / numDash * i;
        if (i % 2 == 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    if (numDash % 2 != 0) {//
        ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    ctx.restore();
}

function convertX(minuteIndex) {
    return (minuteIndex) * info.minuteScale;
}

function convertValueY(value) {
    return (value - info.valueMin) * info.valueScale;
}

function convertVolumeY(volume) {
    return (volume - info.volumeMin) * info.volumeScale;
}