/**
 * Created by user on 2015/4/29.
 */
var DrawStyle = {
    createNew: function (runChart) {
        var ds = {};
        var bgCtx = runChart.getLayer(0).getContext("2d");//背景
        var ctx = runChart.getLayer(1).getContext("2d");//range data draw context
        var mouseCtx = runChart.getLayer(2).getContext("2d");//mouse layer
        console.log(ctx);
        ds.layerFillStyleTest = function (runChart) {
            var newLayer = $(runChart.valueCanvas);
            //for test
            //newLayer.css("top", "0");
            //newLayer.css("left", "0");
            //newLayer.css("top", "50px");
            //newLayer.css("left", "50px");

            //bgCtx.fillStyle = "#D6FFD4";
            //bgCtx.fillRect(0, 0, runChart.canvas.width, runChart.canvas.height);
            //ctx.fillStyle = "#FFD6B3";
            //ctx.fillRect(0, 0, runChart.valueCanvas.width, runChart.valueCanvas.height);
        };

        ds.drawMouseLayerMove = function () {
            //mouseCtx
            var mouse = this.mouse;
            var mouseLast = this.mouseLast;
            var periodAxis = this.periodAxis;
            this.clearLayer(mouseCtx);
            if (mouse.inChartArea) {
                if (mouse.dragging) {
                    var newStartIndex = -1;
                    if (mouse.x > mouseLast.x && periodAxis.endIndex < this.dataDriven.count - 1) {
                        newStartIndex = periodAxis.startIndex + 1;
                    } else if (mouse.x < mouseLast.x && periodAxis.startIndex > 0) {
                        newStartIndex = periodAxis.startIndex - 1;
                    }
                    if (newStartIndex != -1) {
                        this.clearLayer(ctx);
                        this.changePeriodRange(newStartIndex);
                    }
                } else {
                    ds.mouseInfo.call(this);
                }

            }
        };

        ds.mouseInfo = function () {
            var periodAxis = this.periodAxis;
            var source = this.dataDriven.source;
            var list = this.dataDriven.list;
            var data = list[periodAxis.startIndex + this.mouse.index];
            var chartArea = this.area;

            mouseGuideWires();
            drawValueVolumeInfo();

            function mouseGuideWires() {
                mouseCtx.save();
                mouseCtx.strokeStyle = "gray";
                mouseCtx.drawHorizontalLine(chartArea.x, data.valueY, chartArea.right);
                mouseCtx.drawVerticalLine(data.x, chartArea.top, chartArea.y);
                mouseCtx.beginPath();
                mouseCtx.strokeStyle = "#FF7C00";
                mouseCtx.fillStyle = "white";
                mouseCtx.lineWidth = 2;
                mouseCtx.arc(data.x, data.valueY, 3, 0, Math.PI * 2, false);
                mouseCtx.stroke();
                mouseCtx.fill();
                mouseCtx.restore();
            }

            function drawValueVolumeInfo() {
                mouseCtx.save();

                var variance = JsonTool.formatFloat(data.value - source.close, 2);
                var multi = JsonTool.formatFloat(variance / source.close * 100, 2);
                mouseCtx.font = "12px 微軟正黑體";
                mouseCtx.textBaseline = "top";

                var timeText = moment(data.time, "HHmm").format("HH:mm");
                var timeMeasureText = mouseCtx.measureText(timeText);

                var valueText = data.value;
                var valueMeasureText = mouseCtx.measureText(valueText);

                var volumeText = data.volume;
                var volumeMeasureText = mouseCtx.measureText(volumeText);

                var varianceText = variance.toString();
                var varianceMeasureText = mouseCtx.measureText(varianceText);

                var bgHeight = 14;
                //時間bg
                mouseCtx.fillStyle = "#FF7C00";
                var bgWidth = (timeMeasureText.width + 4);
                mouseCtx.fillRect(data.x - bgWidth / 2, chartArea.y, bgWidth, bgHeight);
                //成交價bg
                bgWidth = (valueMeasureText.width + 4);
                mouseCtx.fillRect(chartArea.x - bgWidth, data.valueY - bgHeight / 2, bgWidth, bgHeight);
                //成交量bg
                mouseCtx.fillStyle = "blue";
                bgWidth = (volumeMeasureText.width + 4);
                mouseCtx.fillRect(chartArea.x - bgWidth, data.volumeY - bgHeight / 2, bgWidth, bgHeight);
                //漲幅bg
                mouseCtx.fillStyle = "#FF7C00";

                var fixHeight = ($.browser.mozilla) ? 2 : -1;//2 for firefox
                mouseCtx.fillStyle = "white";
                mouseCtx.fillText(moment(data.time, "HHmm").format("HH:mm"), data.x - (timeMeasureText.width / 2), chartArea.y + fixHeight);
                mouseCtx.fillText(valueText, chartArea.x - (valueMeasureText.width ) - 1, data.valueY - bgHeight / 2 + fixHeight);
                mouseCtx.fillText(volumeText, chartArea.x - (volumeMeasureText.width ) - 1, data.volumeY - bgHeight / 2 + fixHeight);
                if (variance > 0) {
                    mouseCtx.fillStyle = "red";
                } else if (variance < 0) {
                    mouseCtx.fillStyle = "green";
                } else {
                    mouseCtx.fillStyle = "black";
                }
                mouseCtx.textAlign = "left";
                mouseCtx.fillText(variance, chartArea.right, data.valueY - bgHeight + fixHeight);
                mouseCtx.fillText(multi + "%", chartArea.right, data.valueY + fixHeight);

                mouseCtx.restore();

            }
        };

        ds.drawValueAxis = function (axis) {//this = chart
            bgCtx.save();
            bgCtx.drawHorizontalLine(axis.x, axis.y, this.area.right);
            bgCtx.drawVerticalLine(axis.x, axis.y, axis.top);
            bgCtx.restore();
        };

        ds.drawValueAxisTicks = function (axis) {
            bgCtx.save();
            bgCtx.textBaseline = "bottom";
            bgCtx.textAlign = "right";
            var valueFormat;
            if (axis.column == "value") {
                bgCtx.font = "10px Helvetica";
                valueFormat = "0,0.00";
            } else if (axis.column == "volume") {
                bgCtx.font = "8px Helvetica";
                valueFormat = "0,0";
            }
            var x = axis.x - 5;
            var y = axis.y;
            var tick;
            for (var i = 0; i < axis.ticks.tickList.length; i++) {
                tick = axis.ticks.tickList[i];
                bgCtx.fillStyle = tick.color;
                y = axis.y - axis.convertY(tick.value);
                bgCtx.fillText(numeral(tick.value).format(valueFormat), x, y);
                if (i > 0)bgCtx.drawDashLine(axis.x, y, this.area.right, y, 2);//在軸線上不用劃
            }
            bgCtx.restore();
        };

        ds.drawValueAxisData = function (valueAxis) {
            var periodAxis = valueAxis.period;
            var list = this.dataDriven.list;
            var data, i;
            ctx.save();
            if (valueAxis.column == "value") {
                var oldValue, newValue, x, y, oldX, oldY;
                for (i = periodAxis.startIndex; i <= periodAxis.endIndex; i++) {
                    data = list[i];
                    newValue = data[valueAxis.column];
                    x = data.x;
                    y = data[valueAxis.column + "Y"];
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
            } else if (valueAxis.column == "volume") {
                ctx.strokeStyle = "blue";
                ctx.fillStyle = "#3E92FF";
                var startX, endX, quarterScale = periodAxis.scale / 4;
                ctx.beginPath();
                for (i = periodAxis.startIndex; i <= periodAxis.endIndex; i++) {
                    data = list[i];
                    startX = data.x - quarterScale;
                    endX = data.x + quarterScale;
                    ctx.moveTo(startX, valueAxis.y);
                    ctx.lineTo(startX, data[valueAxis.column + "Y"]);
                    ctx.lineTo(endX, data[valueAxis.column + "Y"]);
                    ctx.lineTo(endX, valueAxis.y);
                }
                ctx.stroke();
                ctx.fill();
            }
            ctx.restore();
        };

        ds.drawPeriodAxisTicks = function (axis) {
            ctx.save();
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            var y = this.area.y + 10;
            var timeIndex = 0;
            var timeStep = 0;
            if (axis.displayRange <= 30) {
                timeStep = 5;//30分內 每隔5分顯示
            } else if (axis.displayRange <= 60) {
                timeStep = 10;//一小時內 每隔10分顯示
            } else if (axis.displayRange <= 120) {
                timeStep = 30;//2小時內 每隔30分顯示
            } else {
                timeStep = 60;//超過2小時 每隔60分顯示
            }
            var list = this.dataDriven.list;
            for (var i = axis.startIndex; i < axis.endIndex; i += timeStep) {
                ctx.fillText(moment(list[i][axis.column], "HHmm").format("HH:mm"), axis.convertX(timeIndex), y);
                timeIndex += timeStep;
            }
            if (i != axis.endIndex - 1) {
                //ctx.fillText(moment(drawData.valueList[info.timeEndIndex].time, "HHmm").format("HH:mm"), convertRangeX(info.displayTimeRange - 1), y);
            }
            ctx.restore();
        };

        ds.createValueAxisTicks = function (axis) {
            var ticks;
            if (axis.column == "value") {
                ticks = axis.createTicks(6);
                var top = axis.valueMin;
                var i;
                for (i = 0; i < ticks.count / 2; i++) {
                    ticks.addTick(top, "green");
                    top = JsonTool.formatFloat(top + ticks.distance, 2);
                }
                top = axis.source.close;
                for (i = 0; i < ticks.count / 2; i++) {
                    if (i == 0) {
                        ticks.addTick(top, "black");
                    } else {
                        ticks.addTick(top, "red");
                    }
                    top = JsonTool.formatFloat(top + ticks.distance, 2);
                }
                ticks.addTick(axis.valueMax, "red");
            } else if (axis.column == "volume") {
                ticks = axis.createTicks(3);
                ticks.addTick(0, "blue");
                ticks.addTick(axis.valueMax / 2, "blue");
                ticks.addTick(axis.valueMax, "blue");
            }
            return ticks;
        };

        ds.layerFillStyleTest(runChart);
        return ds;
    }
};