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
var drawingSurfaceImageData;
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
    console.dir(info);
    //console.dir(chartArea);
    draw();
    canvas.onmouseover = canvasOnMouseOver;
    canvas.onmousemove = canvasOnMouseMove;
    canvas.onmouseout = canvasOnMouseOut;
}

function draw(){
    drawValueAxis();
    drawVolumeAxis();
    drawHourText();
    drawValueText();
    drawVolumeText();
    drawValueDashLine();
    drawVolumeDashLine();
    generateDataLoc();
    drawValueLine();
    drawVolumeBar();
    drawInfo();
    saveDrawingSurface();
    drawValueVolumeInfo(drawData.valueList[drawData.valueList.length-1]);

    var x = convertX(0);
    var index = xToIndex(x);
    console.log("x="+x+",log="+index);
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
    var y = chartArea.y + 10;
    var currentHour = info.startHour;
    var minuteList = info.minuteTicks();
    for (var i = 0; i < minuteList.length; i++) {
        ctx.fillText(currentHour.toString(), convertX(minuteList[i]), y);
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
        drawDashLine(valueAxis.x, y, valueAxis.right, y, 2);
    }
}

function drawVolumeDashLine() {
    var y = volumeAxis.y;
    var volumeTickList = info.volumeTicks();
    for (var i = 0; i < volumeTickList.length; i++) {
        y = volumeAxis.y - convertVolumeY(volumeTickList[i]);
        drawDashLine(volumeAxis.x, y, volumeAxis.right, y, 2);
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

function generateDataLoc() {
    var data;
    for (var i = 0; i < drawData.valueList.length; i++) {
        data = drawData.valueList[i];
        data.x = convertX(i);
        //console.log("data.x="+data.x);
        data.valueY = valueAxis.y - convertValueY(data.value);
        data.volumeY = volumeAxis.y - convertVolumeY(data.volume);
    }
}

function drawValueLine() {
    ctx.save();
    var data;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (var i = 0; i < drawData.valueList.length; i++) {
        data = drawData.valueList[i];
        if (i == 0) {
            ctx.moveTo(data.x, data.valueY);
        } else {
            ctx.lineTo(data.x, data.valueY);
        }
    }
    ctx.stroke();
    ctx.restore();
}

function drawVolumeBar() {
    ctx.save();
    var data;
    ctx.strokeStyle = "green";
    ctx.beginPath();
    for (var i = 0; i < drawData.valueList.length; i++) {
        data = drawData.valueList[i];
        ctx.moveTo(data.x, volumeAxis.y);
        ctx.lineTo(data.x, data.volumeY);
    }
    ctx.stroke();
    ctx.restore();
}

function drawInfo() {
    ctx.save();
    var x = 5;
    var y = 5;
    ctx.font = "16px Helvetica";
    ctx.textBaseline = "top";
    ctx.fillText(drawData.name, x, y);
    ctx.restore();
}

function drawValueVolumeInfo(data){
    ctx.save();
    var valueX = 80;
    var volumeX = 80;
    var timeX = 250;
    var y = 5;
    var vx = 160;
    var y2 = 20;
    var variance = JsonTool.formatFloat(data.value - drawData.close,2);
    var multi = JsonTool.formatFloat(variance/drawData.close*100,2);
    ctx.font = "12px Helvetica";
    ctx.textBaseline = "top";
    ctx.fillText("成交價:"+data.value, valueX, y);
    if(variance>0){
        ctx.fillText("+"+variance+"("+multi+")%",vx,y);
    }else if(variance<0){
        ctx.fillText("-"+variance+"("+multi+")%",vx,y);
    }else{
        ctx.fillText(variance+"("+multi+")%",vx,y);
    }
    ctx.fillText("成交量:"+data.volume, volumeX, y2);
    ctx.fillText(moment(data.time, "HHmm").format("HH:mm"), timeX, y);
    ctx.restore();
}

function drawGuideWires(x){
    ctx.save();
    drawVerticalAxis(x, chartArea.top, chartArea.y);
    ctx.restore();
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
    return chartArea.x + (minuteIndex) * info.minuteScale;
}

function xToIndex(x) {
    return Math.floor((x  - chartArea.x) / info.minuteScale);
}

function convertValueY(value) {
    return (value - info.valueMin) * info.valueScale;
}

function convertVolumeY(volume) {
    return (volume - info.volumeMin) * info.volumeScale;
}

function canvasOnMouseOver(e){
    //console.log("canvasOnMouseOver");
    //restoreDrawingSurface();
}

function canvasOnMouseMove(e) {
    //console.log("canvasOnMouseMove");
    e.preventDefault;
    var loc = windowToCanvas(e.clientX, e.clientY);
    var index = xToIndex(loc.x);
    //console.log("index=" + index);
    if(index>=0&&index<drawData.valueList.length){
        //console.log("index="+index+":x="+ loc.x+",y="+ loc.y);
        restoreDrawingSurface();
        drawValueVolumeInfo(drawData.valueList[index]);
        drawGuideWires(loc.x);
    }
    //console.log("x="+ loc.x+",y="+ loc.y);
}

function canvasOnMouseOut(e){
    //console.log("canvasOnMouseOut");
    //saveDrawingSurface();
}

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x-bbox.left,
        y: y-bbox.top
    }
}

function saveDrawingSurface(){
    drawingSurfaceImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}
function restoreDrawingSurface(){
    ctx.putImageData(drawingSurfaceImageData,0,0);
}