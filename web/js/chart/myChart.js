/**
 * Created by user on 2015/4/25.
 */
var Chart = {
    createNew: function (canvasDom) {
        var chart = {};
        chart.canvas = canvasDom;
        chart.ctx = chart.canvas.getContext("2d");
        chart.PADDING_BOTTOM = 0;
        chart.PADDING_TOP = 0;
        chart.PADDING_LEFT = 0;
        chart.PADDING_RIGHT = 0;
        chart.padding = function(){
          if(arguments.length==1){
              var padding = arguments[0];
              chart.PADDING = padding;
              chart.PADDING_LEFT = padding;
              chart.PADDING_BOTTOM = padding;
              chart.PADDING_RIGHT = padding;
              chart.PADDING_TOP = padding;
          } else if(arguments.length==4){
              chart.PADDING_LEFT = arguments[0];
              chart.PADDING_BOTTOM = arguments[1];
              chart.PADDING_RIGHT = arguments[2];
              chart.PADDING_TOP = arguments[3];
          }
        };
        return chart;
    }
};

var Period = {
    createNew: function () {

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
        chart.setArea = function(){
            chart.area.x = chart.PADDING_LEFT;
            chart.area.y = chart.canvas.height - chart.PADDING_BOTTOM;
            chart.area.right = chart.canvas.width - chart.PADDING_RIGHT;
            chart.area.width = chart.area.right - chart.area.x;
            chart.area.top = chart.PADDING_TOP;
            chart.area.height = chart.area.y - chart.area.top;
        };
        chart.draw = function(initFunction){
            if(typeof initFunction=="function"){
                initFunction.call(this,chart.canvas,chart.ctx);//this = chart
            }
        };
        return chart;
    }
};