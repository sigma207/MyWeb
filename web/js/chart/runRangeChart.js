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
var mouseLast = {};
var drawingAxisImageData;
var drawingSurfaceImageData;
AXIS_MARGIN = 40;
AXIS_MARGIN_BOTTOM = 20;

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
    drawBase();
    drawTimeRangeData();
    saveDrawingSurface();
    //chartArea.x + (minuteIndex * info.timeRangeScale);
    //console.log("chartArea.x=" + chartArea.x + ",timeRangeScale=" + info.timeRangeScale + "chartArea.width=" + chartArea.width);
    //var x = convertRangeX(0);
    //var index = xToRangeIndex(x);
    //console.log("range x=" + x + ",index=" + index);
    //index = xToRangeIndex(39);
    //x = convertRangeX(index);
    //console.log("range x=" + x + ",index=" + index);

    //要把此js重寫成物件方式處理,不然這些事件會重覆宣告監聽
    canvas.onmouseover = canvasOnMouseOver;
    canvas.onmousedown = canvasOnMouseDown;
    canvas.onmouseup = canvasOnMouseUp;
    canvas.onmousemove = canvasOnMouseMove;
    canvas.onmouseout = canvasOnMouseOut;
    $("canvas").mousewheel(canvasOnMouseWheel);
}
function drawBase() {
    drawValueAxis();
    drawVolumeAxis();

    drawValueText();
    drawVolumeText();
    drawValueDashLine();
    drawVolumeDashLine();
    saveDrawingAxisImageData();
}
function drawTimeRangeData() {
    generateRangeDataLoc();
    drawRangeTimeText();
    drawRangeValueLine();
    drawRangeVolumeBar();
}

function drawMouseInfo(index) {
    drawInfo();
    drawValueVolumeInfo(drawData.valueList[info.timeStartIndex + index]);
    drawGuideWires(index);
}

/**
 * 滑鼠左右移動是控制timeStartIndex
 * @param timeStartIndex
 */
function changeTimeRange(timeStartIndex) {
    info.timeStartIndex = timeStartIndex;
    info.timeEndIndex = info.timeStartIndex + info.displayTimeRange - 1;
    info.timeRangeScale = chartArea.width / (info.displayTimeRange - 1);
    drawTimeRangeData();
}

/**
 * 滑鼠滾輪上下移動是控制displayTimeRange
 * 1.先確認range
 * 2.變更timeStartIndex指標
 * @param addValue (+1或-1)
 */
function addDisplayTimeRange(addValue) {
    var value = info.displayTimeRange + (addValue * 2);
    var newRange = 0;
    if (value <= drawData.valueList.length) {
        if (value <= info.minDisplaytimeRange) {
            newRange = info.minDisplaytimeRange;//最小
        } else {
            newRange = value;//範圍內隨便你
        }
    } else {
        newRange = drawData.valueList.length;//最大
    }

    var start = info.timeStartIndex - value;//30->29
    var end = info.timeEndIndex + value;//39->40

    if (start >= 0 && end < drawData.valueList.length) {
        restoreDrawingAxisImageData();
        console.log("newRange=" + newRange + ",start=" + start + ",end=" + end);
        info.displayTimeRange = newRange;
        changeTimeRange(start);
    }
}

function initInfo() {
    info.dragging = false;

    info.valueList = drawData.valueList;
    info.hourDistance = 60;
    info.displayTimeRange = 10;
    info.minDisplaytimeRange = 10;
    info.timeStartIndex = info.valueList.length - info.displayTimeRange;
    info.timeEndIndex = info.timeStartIndex + info.displayTimeRange - 1;
    info.timeRangeScale = chartArea.width / (info.displayTimeRange - 1);
    info.timeGap = chartArea.width / info.displayTimeRange;


    info.timeScale = chartArea.width / info.valueList.length;


    info.valueMin = JsonTool.formatFloat(drawData.valueMin, 2);
    info.valueMax = JsonTool.formatFloat(drawData.valueMax, 2);
    info.valueMiddle = JsonTool.formatFloat(drawData.close, 2);
    info.valueDistance = JsonTool.formatFloat(info.valueMax - info.valueMin, 2);
    info.numValueTick = 6;
    info.tickDistance = JsonTool.formatFloat(info.valueDistance / info.numValueTick, 2);
    info.valueScale = valueAxis.height / info.valueDistance;
    info.valueTicks = function () {
        var temp = [];
        var top = this.valueMin;
        var i;
        for (i = 0; i < this.numValueTick / 2; i++) {
            temp.push({top: top, color: "green"});
            top = JsonTool.formatFloat(top + this.tickDistance, 2);
        }
        top = this.valueMiddle;
        for (i = 0; i < this.numValueTick / 2; i++) {
            if (i == 0) {
                temp.push({top: top, color: "black"});
            } else {
                temp.push({top: top, color: "red"});
            }
            top = JsonTool.formatFloat(top + this.tickDistance, 2);
        }
        temp.push({top: this.valueMax, color: "red"});
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
    chartArea.y = canvas.height - AXIS_MARGIN_BOTTOM;
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

function drawRangeTimeText() {
    ctx.save();
    ctx.textAlign = "center";
    var y = chartArea.y + 10;
    var timeIndex = 0;
    var timeStep = 0;
    var currentHour = parseInt(drawData.valueList[info.timeStartIndex].time.toString().substring(0, 2));
    if (info.displayTimeRange < 60) {
        timeStep = 5;//一小時內 每隔5分顯示
    } else if (info.displayTimeRange >= 60) {
        timeStep = 30;//超過一小時的資料 每隔30分顯示
    } else if (info.displayTimeRange >= 180) {
        timeStep = 60;//超過一小時的資料 每隔60分顯示
    }
    for (var i = info.timeStartIndex; i < info.timeEndIndex; i += timeStep) {
        ctx.fillText(moment(drawData.valueList[i].time, "HHmm").format("HH:mm"), convertRangeX(timeIndex), y);
        timeIndex += timeStep;
    }
    if (i != info.timeEndIndex - 1) {
        ctx.fillText(moment(drawData.valueList[info.timeEndIndex].time, "HHmm").format("HH:mm"), convertRangeX(info.displayTimeRange - 1), y);
    }
    //for (var i = 0; i <= info.displayTimeRange; i+=info.hourDistance) {
    //    ctx.fillText(currentHour.toString(), convertRangeX(i), y);
    //    currentHour++;
    //}
    ctx.restore();
}

function drawValueText() {
    ctx.save();
    ctx.font = "10px Helvetica";
    ctx.textAlign = "right";
    var x = valueAxis.x - 5;
    var y = valueAxis.y;
    var valueTickList = info.valueTicks();
    var tick;
    for (var i = 0; i < valueTickList.length; i++) {
        tick = valueTickList[i];
        ctx.fillStyle = tick.color;
        ctx.fillText(numeral(tick.top).format("0,0.00"), x, y - convertValueY(tick.top));
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
    ctx.save();
    ctx.font = "8px Helvetica";
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    var x = volumeAxis.x - 5;
    var y = volumeAxis.y;
    var volumeTickList = info.volumeTicks();
    for (var i = 0; i < volumeTickList.length; i++) {
        ctx.fillText(volumeTickList[i], x, y - convertVolumeY(volumeTickList[i]));
    }
    ctx.restore();
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

function generateRangeDataLoc() {
    var data;
    var timeIndex = info.timeStartIndex;
    for (var i = 0; i < info.displayTimeRange; i++, timeIndex++) {
        data = drawData.valueList[timeIndex];
        data.x = convertRangeX(i);
        data.valueY = valueAxis.y - convertValueY(data.value);
        data.volumeY = volumeAxis.y - convertVolumeY(data.volume);
    }
}

function drawRangeValueLine() {
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
    var y = 10;
    ctx.font = "14px 微軟正黑體";
    ctx.textBaseline = "top";
    ctx.fillText(drawData.name, x, y);
    ctx.restore();
}

function drawValueVolumeInfo(data) {
    ctx.save();
    var valueX = 80;
    var volumeX = 80;
    var timeX = 250;
    var y = 5;
    var vx = 160;
    var y2 = 20;
    var variance = JsonTool.formatFloat(data.value - drawData.close, 2);
    var multi = JsonTool.formatFloat(variance / drawData.close * 100, 2);
    ctx.font = "12px 微軟正黑體";
    ctx.textBaseline = "top";
    ctx.fillText("成交價:" + data.value, valueX, y);
    if (variance > 0) {
        ctx.fillText("+" + variance + "(" + multi + ")%", vx, y);
    } else if (variance < 0) {
        ctx.fillText("-" + variance + "(" + multi + ")%", vx, y);
    } else {
        ctx.fillText(variance + "(" + multi + ")%", vx, y);
    }
    ctx.fillText("成交量:" + data.volume, volumeX, y2);
    ctx.fillText(moment(data.time, "HHmm").format("HH:mm"), timeX, y);
    ctx.restore();
}

function drawGuideWires(index) {
    ctx.save();
    ctx.drawVerticalLine(drawData.valueList[info.timeStartIndex + index].x, chartArea.top, chartArea.y);
    //ctx.drawVerticalLine(x, chartArea.top, chartArea.y);
    ctx.restore();
}

function convertX(minuteIndex) {
    return chartArea.x + (minuteIndex) * info.timeScale;
}

function convertRangeX(minuteIndex) {
    return chartArea.x + (minuteIndex * info.timeRangeScale);
}

function xToIndex(x) {
    return Math.floor((x - chartArea.x) / info.timeScale);
}

function xToRangeIndex(x) {
    if (x < chartArea.x) {
        return -1;
    } else {
        return Math.round((x - chartArea.x) / info.timeRangeScale);
    }

}

function convertValueY(value) {
    return (value - info.valueMin) * info.valueScale;
}

function convertVolumeY(volume) {
    return (volume - info.volumeMin) * info.volumeScale;
}

function canvasOnMouseOver(e) {
    //console.log("canvasOnMouseOver");
    //restoreDrawingSurface();
}

function canvasOnMouseDown(e) {
    e.preventDefault();
    var loc = windowToCanvas(e.clientX, e.clientY);
    mouseLast.x = loc.x;
    mouseLast.y = loc.y;
    info.dragging = true;
}


function dragStop() {
    console.log("dragStop");
    info.dragging = false;
    saveDrawingSurface();
    drawMouseInfo(mouseLast.index);
}

function canvasOnMouseMove(e) {
    //console.log("canvasOnMouseMove");
    e.preventDefault;
    var loc = windowToCanvas(e.clientX, e.clientY);
    var index = xToRangeIndex(loc.x);
    //if (loc.x < 0 || loc.x >= canvas.width)return;
    //console.log("x=" + loc.x + ",index=" + index);
    if (info.dragging) {
        var newTimeStartIndex = info.timeStartIndex - 1;
        if (loc.x > mouseLast.x) {
            newTimeStartIndex = info.timeStartIndex + 1;
        }
        if (newTimeStartIndex != info.timeStartIndex && newTimeStartIndex >= 0 && newTimeStartIndex <= info.valueList.length - info.displayTimeRange) {
            //console.log("newTimeStartIndex="+newTimeStartIndex);
            restoreDrawingAxisImageData();
            console.log("changeTimeRange");
            changeTimeRange(newTimeStartIndex);
        }
        mouseLast.x = loc.x;
        mouseLast.y = loc.y;
        mouseLast.index = index;
    } else {
        if (loc.x >= chartArea.x && index >= 0 && index < info.displayTimeRange) {
            restoreDrawingSurface();
            drawMouseInfo(index);
        }

    }


    //console.log("x="+ loc.x+",y="+ loc.y);
}

function canvasOnMouseOut(e) {
    //console.log("canvasOnMouseOut");
    //saveDrawingSurface();

    if (info.dragging) {
        dragStop();
    } else {
        restoreDrawingSurface();
    }

}

function canvasOnMouseUp(e) {
    e.preventDefault();
    dragStop();
}

function canvasOnMouseWheel(e, delta) {
    e.originalEvent.preventDefault();
    console.log(delta);

    addDisplayTimeRange(delta);
}


function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left,
        y: y - bbox.top
    };
    //return {
    //    x: x - bbox.left * (canvas.width / bbox.width),
    //    y: y - bbox.top * (canvas.height / bbox.height)
    //};
}

function saveDrawingSurface() {
    drawingSurfaceImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function restoreDrawingSurface() {
    ctx.putImageData(drawingSurfaceImageData, 0, 0);
}

function saveDrawingAxisImageData() {
    drawingAxisImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingAxisImageData() {
    ctx.putImageData(drawingAxisImageData, 0, 0);
}