/**
 * Created by user on 2015/4/29.
 */
var DrawStyle = {
    createNew: function (runChart) {
        var ds = {};
        var bgCtx = runChart.canvas.getContext("2d");//背景
        var ctx = runChart.valueCanvas.getContext("2d");//range data draw context

        ds.layerFillStyleTest = function (runChart) {
            var newLayer = $(runChart.valueCanvas);
            //for test
            newLayer.css("top", "0");
            newLayer.css("left", "0");
            //newLayer.css("top", "50px");
            //newLayer.css("left", "50px");

            bgCtx.fillStyle = "#D6FFD4";
            bgCtx.fillRect(0, 0, runChart.canvas.width, runChart.canvas.height);
            ctx.fillStyle = "#FFD6B3";
            ctx.fillRect(0, 0, runChart.valueCanvas.width, runChart.valueCanvas.height);

        };

        ds.valueAxis = function (axis) {//this = chart
            bgCtx.save();
            bgCtx.drawHorizontalLine(axis.x, axis.y, this.area.right);
            bgCtx.drawVerticalLine(axis.x, axis.y, axis.top);
            bgCtx.restore();
        };

        ds.valueAxisTicks = function (axis) {
            bgCtx.save();
            bgCtx.textBaseline = "bottom";
            bgCtx.textAlign = "right";
            if (axis.column == "value") {
                bgCtx.font = "10px Helvetica";
            } else if (axis.column == "volume") {
                bgCtx.font = "8px Helvetica";
            }
            var x = axis.x - 5;
            var y = axis.y;
            var tick;
            for (var i = 0; i < axis.ticks.tickList.length; i++) {
                tick = axis.ticks.tickList[i];
                bgCtx.fillStyle = tick.color;
                y = axis.y - axis.convertY(tick.value);
                bgCtx.fillText(numeral(tick.value).format("0,0.00"), x, y);
                if (i > 0)bgCtx.drawDashLine(axis.x, y, this.area.right, y, 2);//在軸線上不用劃
            }
            bgCtx.restore();
        };

        ds.periodAxisTicks = function(axis){
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
                top = axis.data.close;
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