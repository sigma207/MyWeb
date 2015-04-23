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
    $("canvas").mousewheel(canvasOnMouseWheel);
}

function draw(){
    drawValueAxis();
    drawVolumeAxis();

    drawValueText();
    drawVolumeText();
    drawValueDashLine();
    drawVolumeDashLine();
    //generateDataLoc();
    //drawHourText();
    //drawValueLine();
    //drawVolumeBar();
    changeTimeRange(info.valueList.length-info.displayTimeRange);
    generateRangeDataLoc();
    drawRangeHourText();
    drawRangeValueLine();
    drawRangeVolumeBar();
    drawInfo();
    saveDrawingSurface();
    drawValueVolumeInfo(drawData.valueList[info.timeEndIndex]);

    var x = convertX(0);
    var index = xToIndex(x);
    console.log("x="+x+",log="+index);
}

function changeTimeRange(timeStartIndex){
    info.timeStartIndex = timeStartIndex;
    info.timeEndIndex = info.timeStartIndex+info.displayTimeRange-1;
    info.minuteScale = valueAxis.width / info.valueList.length;
}

function initInfo() {
    info.valueList = drawData.valueList;
    info.hourDistance = 60;
    info.displayTimeRange = 20;
    info.timeStartIndex = -1;
    info.timeEndIndex = -1;
    info.minuteScale = 0;
    info.minuteRangeScale = valueAxis.width / info.displayTimeRange;


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
            temp.push({top:top,color:"green"});
            top = JsonTool.formatFloat(top + this.tickDistance, 2);
        }
        top = this.valueMiddle;
        for (i = 0; i < this.numTick / 2; i++) {
            if(i==0){
                temp.push({top:top,color:"black"});
            }else{
                temp.push({top:top,color:"red"});
            }
            top = JsonTool.formatFloat(top + this.tickDistance, 2);
        }
        temp.push({top:this.valueMax,color:"red"});
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
        var count = this.valueList.length;
        for (var i = 0; i <= count; i += this.hourDistance) {
            temp.push(i);
            console.log(i);
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
    ctx.save();
    ctx.strokeStyle = valueAxis.color;
    ctx.lineWidth = valueAxis.lineWidth;
    ctx.drawHorizontalLine(valueAxis.x, valueAxis.y, valueAxis.right);
    ctx.drawVerticalLine(valueAxis.x, valueAxis.y, valueAxis.top);
    ctx.restore();
}

function drawVolumeAxis() {
    ctx.save();
    ctx.strokeStyle = volumeAxis.color;
    ctx.lineWidth = volumeAxis.lineWidth;
    ctx.drawHorizontalLine(volumeAxis.x, volumeAxis.y, volumeAxis.right);
    ctx.drawVerticalLine(volumeAxis.x, volumeAxis.y, volumeAxis.top);
    ctx.restore();
}

function drawHourText() {
    var y = chartArea.y + 10;
    var timeStartIndex = drawData.valueList.length-info.displayTimeRange;
    console.log("timeStartIndex="+timeStartIndex);
    var currentHour = parseInt(drawData.valueList[timeStartIndex].time.toString().substring(0,2));
    var minuteTickList = info.minuteTicks();
    //info.displayTimeRange
    for (var i = 0; i < minuteTickList.length; i++) {
        ctx.fillText(currentHour.toString(), convertX(minuteTickList[i]), y);
        currentHour++;
    }
}

function drawRangeHourText() {
    var y = chartArea.y + 10;
    var currentHour = parseInt(drawData.valueList[info.timeStartIndex].time.toString().substring(0,2));
    for (var i = 0; i <= info.displayTimeRange; i+=info.hourDistance) {
        ctx.fillText(currentHour.toString(), convertRangeX(i), y);
        currentHour++;
    }
}

function drawValueText() {
    ctx.save();
    var x = valueAxis.x - 35;
    var y = valueAxis.y;
    var valueTickList = info.valueTicks();
    var tick;
    for (var i = 0; i < valueTickList.length; i++) {
        tick = valueTickList[i];
        ctx.fillStyle = tick.color;
        ctx.fillText(tick.top, x, y - convertValueY(tick.top));
    }
    ctx.restore();
}

function drawValueDashLine() {
    ctx.save();
    ctx.lineWidth = 0.5;
    var y = valueAxis.y;
    var valueTickList = info.valueTicks();
    var tick;
    for (var i = 1; i < valueTickList.length; i++) {
        tick = valueTickList[i];
        y = valueAxis.y - convertValueY(tick.top);
        ctx.drawDashLine(valueAxis.x, y, valueAxis.right, y, 2);
    }
    ctx.restore();
}

function drawVolumeText() {
    var x = volumeAxis.x - 35;
    var y = volumeAxis.y;
    var volumeTickList = info.volumeTicks();
    for (var i = 0; i < volumeTickList.length; i++) {
        ctx.fillText(volumeTickList[i], x, y - convertVolumeY(volumeTickList[i]));
    }
}

function drawVolumeDashLine() {
    ctx.save();
    ctx.lineWidth = 0.5;
    var y = volumeAxis.y;
    var volumeTickList = info.volumeTicks();
    for (var i = 0; i < volumeTickList.length; i++) {
        y = volumeAxis.y - convertVolumeY(volumeTickList[i]);
        ctx.drawDashLine(volumeAxis.x, y, volumeAxis.right, y, 2);
    }
    ctx.restore();
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

function generateRangeDataLoc() {
    var data;
    var timeIndex = info.timeStartIndex;
    for (var i = 0; i < info.displayTimeRange; i++,timeIndex++) {
        data = drawData.valueList[timeIndex];
        data.x = convertRangeX(i);
        console.log("data.x="+data.x);
        data.valueY = valueAxis.y - convertValueY(data.value);
        data.volumeY = volumeAxis.y - convertVolumeY(data.volume);
    }
}

function drawValueLine() {
    ctx.save();
    var data, oldValue, newValue, x, y, oldX, oldY;
    for (var i = 0; i < drawData.valueList.length; i++) {
        data = drawData.valueList[i];
        newValue = data.value;
        x = data.x;
        y = data.valueY;
        if (i == 0) {
        } else {
            if (newValue > oldValue) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "green";
            }
            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        oldX = x;
        oldY = y;
        oldValue = newValue;
    }
    ctx.restore();
}

function drawRangeValueLine(){
    ctx.save();
    var data, oldValue, newValue, x, y, oldX, oldY;
    for (var i = info.timeStartIndex; i <= info.timeEndIndex; i++) {

        data = drawData.valueList[i];
        newValue = data.value;
        x = data.x;
        y = data.valueY;
        //console.log("i="+i+":x="+x+",y="+y);
        if (i == 0) {
        } else {
            if (newValue > oldValue) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "green";
            }
            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        oldX = x;
        oldY = y;
        oldValue = newValue;
    }
    ctx.restore();
}

function drawVolumeBar() {
    ctx.save();
    var data;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (var i = 0; i < drawData.valueList.length; i++) {
        data = drawData.valueList[i];
        ctx.moveTo(data.x, volumeAxis.y);
        ctx.lineTo(data.x, data.volumeY);
    }
    ctx.stroke();
    ctx.restore();
}

function drawRangeVolumeBar() {
    ctx.save();
    var data;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (var i = info.timeStartIndex; i <= info.timeEndIndex; i++) {
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

function drawGuideWires(index){
    ctx.save();
    ctx.drawVerticalLine(drawData.valueList[info.timeStartIndex+index].x, chartArea.top, chartArea.y);
    ctx.restore();
}

function convertX(minuteIndex) {
    return chartArea.x + (minuteIndex) * info.minuteScale;
}

function convertRangeX(minuteIndex){
    return chartArea.x + (minuteIndex) * info.minuteRangeScale;
}

function xToIndex(x) {
    return Math.floor((x  - chartArea.x) / info.minuteScale);
}

function xToRangeIndex(x) {
    return Math.round((x  - chartArea.x) / info.minuteRangeScale);
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
    var index = xToRangeIndex(loc.x);
    if(loc.x>=chartArea.x&&index>=0&&index<info.displayTimeRange){
        console.log("index="+index+":x="+ loc.x+",y="+ loc.y);
        restoreDrawingSurface();
        drawValueVolumeInfo(drawData.valueList[info.timeStartIndex+index]);
        drawGuideWires(index);
    }
    //console.log("x="+ loc.x+",y="+ loc.y);
}

function canvasOnMouseOut(e){
    //console.log("canvasOnMouseOut");
    //saveDrawingSurface();
}

function canvasOnMouseWheel(e,delta){
    e.originalEvent.preventDefault();
    console.log(delta);
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
}/**
 * Created by user on 2015/4/23.
 */
