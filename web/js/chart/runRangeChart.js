/**
 * Created by user on 2015/4/22.
 */
var chartInit = false;
var chartArea = {};
var valueAxis = {};//成交價
var volumeAxis = {};//成交量
var info = {};
var loc = {};
var canvas;
var ctx;
var drawData;
var mouseLast = {};
var drawingAxisImageData;
var drawingSurfaceImageData;
var valueField,volumeField, timeField;
AXIS_MARGIN = 40;
AXIS_MARGIN_TOP = 20;
AXIS_MARGIN_BOTTOM = 20;
function rangeChartInit(value,volume,time) {
    valueField = value;
    volumeField = volume;
    timeField = time;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

}
function runChart(data) {
    if(!chartInit){
        canvas.onmouseover = canvasOnMouseOver;
        canvas.onmousedown = canvasOnMouseDown;
        canvas.onmouseup = canvasOnMouseUp;
        canvas.onmousemove = canvasOnMouseMove;
        canvas.onmouseout = canvasOnMouseOut;
        $("canvas").mousewheel(canvasOnMouseWheel);
        chartInit = true;
    }
    drawData = data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initChartArea();
    initVolumeAxis();
    initValueAxis();
    initInfo();
    //console.dir(drawData);
    //console.dir(axis);
    //console.dir(info);
    //console.dir(chartArea);
    drawBase();
    drawTimeRangeData();
    saveDrawingSurface();
}
function drawBase() {
    drawValueAxis();
    drawVolumeAxis();

    drawValueText();
    drawVolumeText();
    drawValueDashLine();
    drawVolumeDashLine();
    drawInfo();
    saveDrawingAxisImageData();
}
function drawTimeRangeData() {
    generateRangeDataLoc();
    drawRangeTimeText();
    drawRangeValueLine();
    drawRangeVolumeBar();
}

function drawMouseInfo(index) {
    drawValueVolumeInfo(drawData.valueList[info.timeStartIndex + index]);
    drawGuideWires(index);
}


/**
 * 滑鼠滾輪上下移動是控制displayTimeRange
 * 1.先確認range
 * 2.變更timeStartIndex指標
 * @param addValue (+1或-1)
 */
function addDisplayTimeRange(addValue) {
    var newRange = info.displayTimeRange + (addValue * 2);
    var start, end;
    if (newRange <= info.numData) {
        if (newRange <= info.minDisplaytimeRange) {
            newRange = info.minDisplaytimeRange;//最小
        } else {
            //範圍內隨便你
        }
    } else {
        newRange = info.numData;//最大
    }
    if (newRange != info.displayTimeRange) {
        if (addValue > 0) {//addValue=1
            start = info.timeStartIndex - addValue;//30->29
            end = info.timeEndIndex + addValue;//39->40
        } else {//addValue=-1
            start = info.timeStartIndex - addValue;//30->31
            end = info.timeEndIndex + addValue;//39->38
        }
    }

    if (start >= 0 && end < info.numData) {
        restoreDrawingAxisImageData();
        console.log("newRange=" + newRange + ",start=" + start + ",end=" + end);
        info.displayTimeRange = newRange;
        changeTimeRange(start);
        saveDrawingSurface();
    }
}

/**
 * 滑鼠左右移動是控制timeStartIndex
 * @param timeStartIndex
 */
function changeTimeRange(timeStartIndex) {
    info.timeStartIndex = timeStartIndex;
    info.timeEndIndex = info.timeStartIndex + info.displayTimeRange - 1;
    info.timeRangeScale = chartArea.width / (info.displayTimeRange + 1);
    drawTimeRangeData();
}

function initInfo() {
    info.dragging = false;
    info.numData = drawData.valueList.length;
    info.hourDistance = 60;
    info.displayTimeRange = 10;
    info.minDisplaytimeRange = 10;
    info.timeStartIndex = info.numData - info.displayTimeRange;
    info.timeEndIndex = info.timeStartIndex + info.displayTimeRange - 1;
    info.timeRangeScale = chartArea.width / (info.displayTimeRange + 1);

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
}

function initChartArea() {
    chartArea.x = AXIS_MARGIN;
    chartArea.y = canvas.height - AXIS_MARGIN_BOTTOM;
    chartArea.right = canvas.width - AXIS_MARGIN;
    chartArea.width = chartArea.right - chartArea.x;
    chartArea.top = AXIS_MARGIN_TOP;
    chartArea.height = chartArea.y - chartArea.top;
    chartArea.volumeHeight = chartArea.height / 5;
    chartArea.spaceHeight = chartArea.height / 20;
    chartArea.valueHeight = chartArea.height - chartArea.volumeHeight - chartArea.spaceHeight;

    chartArea.volumeY = chartArea.y;
    chartArea.valueY = chartArea.volumeY - chartArea.volumeHeight - chartArea.spaceHeight;
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
    if (info.displayTimeRange <= 30) {
        timeStep = 5;//30分內 每隔5分顯示
    } else if (info.displayTimeRange <= 60) {
        timeStep = 10;//一小時內 每隔10分顯示
    } else if (info.displayTimeRange <= 120) {
        timeStep = 30;//2小時內 每隔30分顯示
    } else {
        timeStep = 60;//超過2小時 每隔60分顯示
    }
    for (var i = info.timeStartIndex; i < info.timeEndIndex; i += timeStep) {
        ctx.fillText(moment(drawData.valueList[i][timeField], "HHmm").format("HH:mm"), convertRangeX(timeIndex), y);
        timeIndex += timeStep;
    }
    if (i != info.timeEndIndex - 1) {
        //ctx.fillText(moment(drawData.valueList[info.timeEndIndex].time, "HHmm").format("HH:mm"), convertRangeX(info.displayTimeRange - 1), y);
    }
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
    ctx.textBaseline = "bottom";
    ctx.textAlign = "right";
    ctx.fillStyle = "blue";
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
    //i=1底部的線不用劃(i=0=chartArea.y)
    for (var i = 1; i < volumeTickList.length; i++) {
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
        data.valueY = valueAxis.y - convertValueY(data[valueField]);
        data.volumeY = volumeAxis.y - convertVolumeY(data[volumeField]);
    }
}

function drawRangeValueLine() {
    ctx.save();
    var data, oldValue, newValue, x, y, oldX, oldY;
    for (var i = info.timeStartIndex; i <= info.timeEndIndex; i++) {

        data = drawData.valueList[i];
        newValue = data[valueField];
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

function drawRangeVolumeBar() {
    ctx.save();
    var data;
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "#3E92FF";
    var startX, endX, quarterScale = info.timeRangeScale / 4;
    ctx.beginPath();
    for (var i = info.timeStartIndex; i <= info.timeEndIndex; i++) {
        data = drawData.valueList[i];
        startX = data.x - quarterScale;
        endX = data.x + quarterScale;
        ctx.moveTo(startX, volumeAxis.y);
        ctx.lineTo(startX, data.volumeY);
        ctx.lineTo(endX, data.volumeY);
        ctx.lineTo(endX, volumeAxis.y);
        //ctx.moveTo(data.x, volumeAxis.y);
        //ctx.lineTo(data.x, data.volumeY);
    }
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

function drawInfo() {
    ctx.save();
    var x = canvas.width / 2;
    var y = 3;
    ctx.font = "12px 微軟正黑體";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(drawData.name, x, y);
    ctx.restore();
}

function drawValueVolumeInfo(data) {
    ctx.save();

    var variance = JsonTool.formatFloat(data[valueField] - drawData.close, 2);
    var multi = JsonTool.formatFloat(variance / drawData.close * 100, 2);
    ctx.font = "12px 微軟正黑體";
    ctx.textBaseline = "top";

    var timeText = moment(data[timeField], "HHmm").format("HH:mm");
    var timeMeasureText = ctx.measureText(timeText);

    var valueText = data[valueField];
    var valueMeasureText = ctx.measureText(valueText);

    var volumeText = data[volumeField];
    var volumeMeasureText = ctx.measureText(volumeText);

    var varianceText = variance.toString();
    var varianceMeasureText = ctx.measureText(varianceText);

    var bgHeight = 14;
    //時間bg
    ctx.fillStyle = "#FF7C00";
    var bgWidth = (timeMeasureText.width + 4);
    ctx.fillRect(data.x - bgWidth / 2, chartArea.y, bgWidth, bgHeight);
    //成交價bg
    bgWidth = (valueMeasureText.width + 4);
    ctx.fillRect(chartArea.x - bgWidth, data.valueY - bgHeight / 2, bgWidth, bgHeight);
    //成交量bg
    ctx.fillStyle = "blue";
    bgWidth = (volumeMeasureText.width + 4);
    ctx.fillRect(chartArea.x - bgWidth, data.volumeY - bgHeight / 2, bgWidth, bgHeight);
    //漲幅bg
    ctx.fillStyle = "#FF7C00";
    //if (variance > 0) {
    //    ctx.fillStyle = "red";
    //} else if(variance < 0) {
    //    ctx.fillStyle = "green";
    //} else{
    //    ctx.fillStyle = "black";
    //}
    //bgWidth = (varianceMeasureText.width + 4);
    //ctx.fillRect(chartArea.right , data.valueY-bgHeight, canvas.width-chartArea.right, bgHeight*2);

    var fixHeight = ($.browser.mozilla)?2:-1;//2 for firefox
    ctx.fillStyle = "white";
    ctx.fillText(moment(data[timeField], "HHmm").format("HH:mm"), data.x - (timeMeasureText.width / 2), chartArea.y + fixHeight);
    ctx.fillText(valueText, chartArea.x - (valueMeasureText.width ) - 1, data.valueY - bgHeight / 2 + fixHeight);
    ctx.fillText(volumeText, chartArea.x - (volumeMeasureText.width ) - 1, data.volumeY - bgHeight / 2 + fixHeight);
    if (variance > 0) {
        ctx.fillStyle = "red";
    } else if (variance < 0) {
        ctx.fillStyle = "green";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.textAlign = "right";
    ctx.fillText(variance, canvas.width - 2, data.valueY - bgHeight + fixHeight);
    ctx.fillText(multi + "%", canvas.width - 2, data.valueY + fixHeight);

    ctx.restore();

}

function drawGuideWires(index) {
    ctx.save();
    var data = drawData.valueList[info.timeStartIndex + index];
    //ctx.drawVerticalLine(data.x, chartArea.top, chartArea.y);
    ctx.drawHorizontalLine(chartArea.x, data.valueY, data.x - 2);//圓心左邊的線
    ctx.drawHorizontalLine(data.x + 2, data.valueY, chartArea.right);//圓心右邊的線
    ctx.drawVerticalLine(data.x, chartArea.top, data.valueY - 2);//圓心上面的線
    ctx.drawVerticalLine(data.x, data.valueY + 2, chartArea.y);//圓心下面的線
    ctx.beginPath();
    ctx.strokeStyle = "#FF7C00";
    ctx.lineWidth = 2;
    ctx.arc(data.x, data.valueY, 2, 0, Math.PI * 2, false);
    ctx.stroke();
    //ctx.drawVerticalLine(x, chartArea.top, chartArea.y);
    ctx.restore();
}

function convertRangeX(minuteIndex) {
    return chartArea.x + info.timeRangeScale + (minuteIndex * info.timeRangeScale);
}

function xToRangeIndex(x) {
    if (x < chartArea.x + info.timeRangeScale) {
        return -1;
    } else {
        return Math.round((x - (chartArea.x + info.timeRangeScale)) / info.timeRangeScale);
    }
}

function convertValueY(value) {
    return (value - info.valueMin) * info.valueScale;
}

function convertVolumeY(volume) {
    return (volume - info.volumeMin) * info.volumeScale;
}

function mouseLocation(e) {
    var temp = windowToCanvas(e.clientX, e.clientY);
    loc.x = temp.x;
    loc.y = temp.y;
    loc.index = xToRangeIndex(loc.x);
    loc.inChartArea = (loc.x >= chartArea.x + info.timeRangeScale && loc.x <= chartArea.right - info.timeRangeScale);
}

function dragStop() {
    //console.log("dragStop");
    if (info.dragging) {//如果onMouseDonw是在chartArea外面時,dragging會是false
        info.dragging = false;
        saveDrawingSurface();//停止拖曳時要把畫面儲存
    }
}

function canvasOnMouseOver(e) {
    //console.log("canvasOnMouseOver");
}

function canvasOnMouseDown(e) {
    e.preventDefault();
    mouseLocation(e);
    if (loc.inChartArea) {
        restoreDrawingSurface();
        info.dragging = true;
    }
}

function canvasOnMouseMove(e) {
    //console.log("canvasOnMouseMove");
    e.preventDefault;
    mouseLocation(e);
    if (loc.inChartArea) {
        if (info.dragging) {
            var newTimeStartIndex = -1;
            if (loc.x > mouseLast.x && info.timeEndIndex < info.numData - 1) {
                newTimeStartIndex = info.timeStartIndex + 1;
            } else if (loc.x < mouseLast.x && info.timeStartIndex > 0) {
                newTimeStartIndex = info.timeStartIndex - 1;
            }
            if (newTimeStartIndex != -1) {
                restoreDrawingAxisImageData();
                changeTimeRange(newTimeStartIndex);
            }

            mouseLast.x = loc.x;
            mouseLast.y = loc.y;
            mouseLast.index = loc.index;
        } else {
            restoreDrawingSurface();
            drawMouseInfo(loc.index);
        }
    } else {
        if (!info.dragging) {
            restoreDrawingSurface();
        }
        //
    }
}

function canvasOnMouseOut(e) {
    if (info.dragging) {
        dragStop();
    } else {
        restoreDrawingSurface();
    }
}

function canvasOnMouseUp(e) {
    e.preventDefault();
    dragStop();
    mouseLocation(e);
    if (loc.inChartArea) {//如果還在範圍內才顯示資訊,有可能放開滑鼠時在chartArea外
        drawMouseInfo(mouseLast.index);
    }
}

function canvasOnMouseWheel(e, delta) {
    e.originalEvent.preventDefault();
    if (delta > 1) {//有可能大於1或小於-1,要強迫修正
        delta = 1;
    } else if (delta < -1) {
        delta = -1;
    }
    addDisplayTimeRange(delta);
    mouseLocation(e.originalEvent);
    if (loc.inChartArea) {//如果還在範圍內才顯示資訊,有可能放開滑鼠時在chartArea外
        restoreDrawingSurface();
        drawMouseInfo(loc.index);
    }
}

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left,
        y: y - bbox.top
    };
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