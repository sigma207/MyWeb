/**
 * Created by user on 2015/4/25.
 */
function go(){
    var runChart = RunChart.createNew(document.getElementById("canvas"));
    runChart.draw(chartInit);
    //var runChart2 = RunChart.createNew(document.getElementById("canvas"));
    //runChart2.draw(test2);
    //console.log(runChart.PADDING_RIGHT);
    //console.log(runChart2.PADDING_RIGHT);
}

function chartInit(canvas,ctx){
    //console.log(this);
    //this = runChart...
    this.padding(40,20,40,40);
    //this.PADDING_RIGHT = 50;
    console.log(this);
    console.log(canvas);
    console.log(ctx);
    //console.log(this.PADDING_RIGHT);
}

//function test2(){
//    this.PADDING_RIGHT = 30;
//}