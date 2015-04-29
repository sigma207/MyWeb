/**
 * Created by user on 2015/4/25.
 */
var Chart = {
    createNew: function (canvasDom) {
        var chart = {};
        chart.canvas = canvasDom;
        //chart.ctx = chart.canvas.getContext("2d");//不需要知道ctx的存在
        chart.baseLayer = chart.canvas;
        chart.layers = [];
        chart.layerIndex = 0;
        chart.PADDING_BOTTOM = 0;
        chart.PADDING_TOP = 0;
        chart.PADDING_LEFT = 0;
        chart.PADDING_RIGHT = 0;
        chart.drawStyle = undefined;
        chart.padding = function () {
            if (arguments.length == 1) {
                var padding = arguments[0];
                chart.PADDING = padding;
                chart.PADDING_LEFT = padding;
                chart.PADDING_BOTTOM = padding;
                chart.PADDING_RIGHT = padding;
                chart.PADDING_TOP = padding;
            } else if (arguments.length == 4) {
                chart.PADDING_LEFT = arguments[0];
                chart.PADDING_BOTTOM = arguments[1];
                chart.PADDING_RIGHT = arguments[2];
                chart.PADDING_TOP = arguments[3];
            }
        };

        chart.setDrawStyle = function (drawStyle) {
            chart.drawStyle = drawStyle;
        };

        chart.setDataSource = function (data, listName) {
            chart.dataDriven = DataDriven.createNew(chart, data, listName);
            return chart.dataDriven;
        };

        chart.initLayer = function () {
            chart.layers.push(chart.baseLayer);
            chart.layerIndex = 0;
        };

        chart.addLayer = function (id) {
            var canvas = document.createElement('canvas');
            chart.layers.push(canvas);
            var baseLayer = $(chart.baseLayer);
            var newLayer = $(canvas);
            //newLayer.css("backgroundColor","transparent");
            //$(chart.baseLayer).parent().prepend(newLayer);
            $(chart.baseLayer).parent().append(newLayer);
            //baseLayer.css("position", "relative");
            newLayer.attr("id", id);
            newLayer.attr("width", baseLayer.attr("width"));
            newLayer.attr("height", baseLayer.attr("height"));
            newLayer.css("position", "absolute");
            newLayer.css("opacity", "0.5");
            return canvas;
        };
        chart.initLayer();
        return chart;
    }
};

var DataDriven = {
    createNew: function (chart, data, listName) {
        var dataDriven = {};
        dataDriven.chart = chart;
        dataDriven.listName = listName;
        dataDriven.reset = function (newData) {
            dataDriven.data = newData;
            dataDriven.list = data[listName];
            dataDriven.count = dataDriven.list.length;
        };
        dataDriven.reset(data);
        return dataDriven;
    }
};

var Axis = {
    createNew: function (x, y, length) {
        var axis = {};
        axis.x = x;
        axis.y = y;
        axis.length = length;
        axis.column = undefined;
        return axis;
    }
};

var AxisX = {
    createNew: function (x, y, width) {
        return Axis.createNew(x, y, width);
    }
};

//value volume
var AxisY = {
    createNew: function (x, y, height) {
        var axis = Axis.createNew(x, y, height);
        axis.height = height;
        axis.top = axis.y - axis.height;
        return axis;
    }
};

var ValueAxis = {
    createNew: function (period, column, minColumn, maxColumn, x, y, height) {
        var axis = AxisY.createNew(x, y, height);
        axis.period = period;
        axis.data = axis.period.chart.dataDriven.data;
        axis.column = column;
        axis.minColumn = minColumn;
        axis.maxColumn = maxColumn;

        axis.valueMin = JsonTool.formatFloat(axis.data[axis.minColumn], 2);
        axis.valueMax = JsonTool.formatFloat(axis.data[axis.maxColumn], 2);
        axis.valueDistance = JsonTool.formatFloat(axis.valueMax - axis.valueMin, 2);
        axis.valueScale = axis.height / axis.valueDistance;
        axis.drawAxis = period.chart.drawStyle.valueAxis;
        axis.drawTicks = period.chart.drawStyle.valueAxisTicks;

        axis.convertY = function (value) {
            return (value - axis.valueMin) * axis.valueScale;
        };

        axis.createTicks = function (count) {
            return AxisTicks.createNew(axis, count);
        };
        axis.ticks = period.chart.drawStyle.createValueAxisTicks(axis);
        //period.chart.drawStyle.createValueAxisTicks(axis);
        return axis;
    }
};

var PeriodAxis = {
    createNew: function (runChart) {
        var axis = AxisX.createNew(runChart.area.x, runChart.area.y, runChart.area.width);
        axis.chart = runChart;
        axis.valueAxisList = [];
        axis.displayRange = 10;
        axis.displayRangeMin = 10;
        axis.startIndex = runChart.dataDriven.count - axis.displayRange;
        axis.endIndex = axis.startIndex + axis.displayRange - 1;
        axis.scale = runChart.area.width / (axis.displayRange + 1);
        axis.drawTicks = axis.chart.drawStyle.periodAxisTicks;
        axis.createValueAxis = function (column, minColumn, maxColumn, x, y, height) {
            var valueAxis = ValueAxis.createNew(axis, column, minColumn, maxColumn, x, y, height);
            axis.valueAxisList.push(valueAxis);
            return valueAxis;
        };
        axis.convertX = function(index){
            return axis.chart.area.x + axis.scale + (index * axis.scale);
        };
        axis.generateDataLoc = function(){
            var list = axis.chart.dataDriven.list;
            var data;
            var valueAxis;
            for (var i = 0, timeIndex = axis.startIndex; i < axis.displayRange; i++, timeIndex++) {
                data = list[timeIndex];
                data.x = axis.convertX(i);
                for(var v=0;v<axis.valueAxisList.length;v++){
                    valueAxis = axis.valueAxisList[v];
                    data[valueAxis.column+"Y"] = valueAxis.y - valueAxis.convertY(data[valueAxis.column]);
                }
            }
        };
        return axis;
    }
};

var AxisTicks = {
    createNew: function (axis, count) {
        var axisTick = {};
        axisTick.axis = axis;
        axisTick.count = count;
        axisTick.distance = axis.valueDistance / axisTick.count;
        axisTick.tickList = [];
        axisTick.addTick = function (value, color) {
            var tick = {};
            tick.value = value;
            tick.color = color || "black";
            axisTick.tickList.push(tick);
        };
        return axisTick;
    }
};

var RunChart = {
    createNew: function (canvasDom) {
        var chart = Chart.createNew(canvasDom);
        chart.area = {};
        //var valueCanvas = chart.addLayer("valueLayer");
        chart.valueCanvas = chart.addLayer("valueLayer");

        //var chartArea = chart.area;
        chart.init = function () {
            chart.setArea();
        };
        chart.setArea = function () {
            chart.area.x = chart.PADDING_LEFT;
            chart.area.y = chart.canvas.height - chart.PADDING_BOTTOM;
            chart.area.right = chart.canvas.width - chart.PADDING_RIGHT;
            chart.area.width = chart.area.right - chart.area.x;
            chart.area.top = chart.PADDING_TOP;
            chart.area.height = chart.area.y - chart.area.top;
        };

        chart.createPeriodAxis = function (column) {
            chart.periodAxis = PeriodAxis.createNew(chart);
            chart.periodAxis.column = column;
            return chart.periodAxis;
        };

        chart.draw = function (initFunction) {
            if (typeof initFunction == "function") {
                initFunction.call(this);//this = chart
            }
            chart.periodAxis.generateDataLoc();
            chart.drawAxis();

        };

        chart.drawAxis = function () {
            var periodAxis = chart.periodAxis;
            periodAxis.drawTicks.call(chart, periodAxis);
            var valueAxis;
            for (var i = 0; i < periodAxis.valueAxisList.length; i++) {
                valueAxis = periodAxis.valueAxisList[i];
                valueAxis.drawAxis.call(chart, valueAxis);
                valueAxis.drawTicks.call(chart, valueAxis);
            }
        };
        return chart;
    }
};