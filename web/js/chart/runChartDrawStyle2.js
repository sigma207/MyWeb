/**
 * Created by user on 2015/4/29.
 */
var DrawStyle = {
    createNew: function (runChart) {
        var ds = {};

        ds.drawValueAxis = function (bgCtx) {//this = chart
            var axis = this;
            //console.log("drawValueAxis:%s",axis.column);
            bgCtx.save();
            bgCtx.drawHorizontalLine(axis.x, axis.y, runChart.area.right);
            bgCtx.drawVerticalLine(axis.x, axis.y, axis.top);
            bgCtx.restore();
        };

        ds.drawValueAxisTicks = function (bgCtx) {
            var axis = this;
            axis.ticks = ds.createValueAxisTicks(axis);
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
                if (i > 0)bgCtx.drawDashLine(axis.x, y, runChart.area.right, y, 2);//在軸線上不用劃
            }
            bgCtx.restore();
        };

        ds.drawValueAxisData = function (ctx) {
            var valueAxis = this;
            //console.log("drawValueAxisData:%s",valueAxis.column);
            var periodAxis = valueAxis.period;
            var list = runChart.dataDriven.list;
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

        ds.drawPeriodAxisTicks = function (ctx) {
            var axis = this;
            ctx.save();
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            var y = runChart.area.y + 10;
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
            var list = runChart.dataDriven.list;
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

        ds.drawMouseLayerMove = function (ctx) {
            //mouseCtx
            var mouse = runChart.mouse;
            var periodAxis = runChart.periodAxis;
            if (mouse.inChartArea) {
                if (mouse.dragging) {
                    var newStartIndex = -1;
                    if (mouse.x > mouse.lastX && periodAxis.endIndex < runChart.dataDriven.count - 1) {
                        newStartIndex = periodAxis.startIndex + 1;
                    } else if (mouse.x < mouse.lastX && periodAxis.startIndex > 0) {
                        newStartIndex = periodAxis.startIndex - 1;
                    }
                    if (newStartIndex != -1) {
                        //this.clearLayer(ctx);
                        runChart.changePeriodRange(newStartIndex);
                    }
                } else {
                    ds.mouseInfo.call(runChart,ctx);
                }

            }
        };

        ds.mouseInfo = function (ctx) {
            var periodAxis = runChart.periodAxis;
            var source = runChart.dataDriven.source;
            var list = runChart.dataDriven.list;
            var data = list[periodAxis.startIndex + runChart.mouse.index];
            var chartArea = runChart.area;

            mouseGuideWires();
            drawValueVolumeInfo();

            function mouseGuideWires() {
                ctx.save();
                ctx.strokeStyle = "gray";
                ctx.drawHorizontalLine(chartArea.x, data.valueY, chartArea.right);
                ctx.drawVerticalLine(data.x, chartArea.top, chartArea.y);
                ctx.beginPath();
                ctx.strokeStyle = "#FF7C00";
                ctx.fillStyle = "white";
                ctx.lineWidth = 2;
                ctx.arc(data.x, data.valueY, 3, 0, Math.PI * 2, false);
                ctx.stroke();
                ctx.fill();
                ctx.restore();
            }

            function drawValueVolumeInfo() {
                ctx.save();

                var variance = JsonTool.formatFloat(data.value - source.close, 2);
                var multi = JsonTool.formatFloat(variance / source.close * 100, 2);
                ctx.font = "12px 微軟正黑體";
                ctx.textBaseline = "top";

                var timeText = moment(data.time, "HHmm").format("HH:mm");
                var timeMeasureText = ctx.measureText(timeText);

                var valueText = data.value;
                var valueMeasureText = ctx.measureText(valueText);

                var volumeText = data.volume;
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

                var fixHeight = ($.browser.mozilla) ? 2 : -1;//2 for firefox
                ctx.fillStyle = "white";
                ctx.fillText(moment(data.time, "HHmm").format("HH:mm"), data.x - (timeMeasureText.width / 2), chartArea.y + fixHeight);
                ctx.fillText(valueText, chartArea.x - (valueMeasureText.width ) - 1, data.valueY - bgHeight / 2 + fixHeight);
                ctx.fillText(volumeText, chartArea.x - (volumeMeasureText.width ) - 1, data.volumeY - bgHeight / 2 + fixHeight);
                if (variance > 0) {
                    ctx.fillStyle = "red";
                } else if (variance < 0) {
                    ctx.fillStyle = "green";
                } else {
                    ctx.fillStyle = "black";
                }
                ctx.textAlign = "left";
                ctx.fillText(variance, chartArea.right, data.valueY - bgHeight + fixHeight);
                ctx.fillText(multi + "%", chartArea.right, data.valueY + fixHeight);

                ctx.restore();

            }
        };

        return ds;
    }
};