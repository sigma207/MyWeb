/**
 * Created by user on 2015/4/25.
 */
var Chart = {
    createNew: function (canvasDom) {
        var chart = {};
        chart.name = "gg";
        chart.canvas = canvasDom;
        chart.ctx = chart.canvas.getContext("2d");
        chart.PADDING_BOTTOM = 0;
        chart.PADDING_TOP = 0;
        chart.PADDING_LEFT = 0;
        chart.PADDING_RIGHT = 0;
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

        chart.setDataSource = function (data, listName) {
            chart.dataDriven = DataDriven.createNew(chart, data, listName);
            return chart.dataDriven;
        };
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
    createNew: function (period, x, y, height) {
        var axis = AxisY.createNew(x, y, height);
        axis.period = period;
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
        axis.createValueAxis = function (x, y, height) {
            var valueAxis = ValueAxis.createNew(axis, x, y, height);
            axis.valueAxisList.push(valueAxis);
            return valueAxis;
        };
        return axis;
    }
};

var RunChart = {
    createNew: function (canvasDom) {
        var chart = Chart.createNew(canvasDom);
        chart.area = {};
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
        chart.draw = function (initFunction) {
            if (typeof initFunction == "function") {
                initFunction.call(this, chart.canvas, chart.ctx);//this = chart
            }
            chart.drawValueAxis(chart.ctx);
        };
        chart.createPeriodAxis = function () {
            chart.periodAxis = PeriodAxis.createNew(chart);
            return chart.periodAxis;
        };

        chart.drawValueAxis = function (ctx) {

            var periodAxis = chart.periodAxis;
            var valueAxis;
            for (var i = 0; i < periodAxis.valueAxisList.length; i++) {
                valueAxis = periodAxis.valueAxisList[i];
                ctx.save();
                //ctx.strokeStyle = valueAxis.color;
                //ctx.lineWidth = valueAxis.lineWidth;
                //ctx.strokeStyle = valueAxis.color;
                //ctx.lineWidth = valueAxis.lineWidth;
                ctx.drawHorizontalLine(valueAxis.x, valueAxis.y, chart.area.right);
                ctx.drawVerticalLine(valueAxis.x, valueAxis.y, valueAxis.top);
                ctx.restore();
            }
        };
        return chart;
    }
};