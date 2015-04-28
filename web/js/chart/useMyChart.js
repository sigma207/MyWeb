/**
 * Created by user on 2015/4/25.
 */
function go() {
    var runChart = RunChart.createNew(document.getElementById("canvas"));
    runChart.draw(chartInit);
    //var runChart2 = RunChart.createNew(document.getElementById("canvas"));
    //runChart2.draw(test2);
    //console.log(runChart.PADDING_RIGHT);
    //console.log(runChart2.PADDING_RIGHT);
}

function chartInit(canvas, ctx) {
    //console.log(this);
    var chart = this;//this = runChart...

    chart.padding(40, 20, 40, 40);
    chart.init();


    var drawData = generateStockData()[0];
    generateValueList(drawData);
    //var dd = DataDriven.createNew(drawData,"valueList");
    chart.setDataSource(drawData,"valueList");
    var area = chart.area;
    var spaceHeight = area.height / 20;
    var axisPeriod = PeriodAxis.createNew(area.x, area.y, area.width);
    var axisVolume = ValueAxis.createNew(axisPeriod, area.x, area.y, area.height / 5);
    var axisValue = ValueAxis.createNew(axisPeriod, area.x, axisVolume.y - axisVolume.height - spaceHeight, area.height - axisVolume.height - spaceHeight);
    console.log(this);
    //log(dd);
    //log(axisValue);
}

function test() {

}

function log(msg) {
    console.log(msg);
}

//function test2(){
//    this.PADDING_RIGHT = 30;
//}