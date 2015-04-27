/**
 * Created by user on 2015/4/21.
 */
var forexName = ["美元 日圓", "歐元 美元", "英鎊 美元", "美元 人民幣"];
var metalName = ["倫敦金", "倫敦銀"];
var forexMetalName = forexName.concat(metalName);
var stockName = ["浦發銀行", "白雲機場", "武鋼股份", "東風汽車", "IF1505", "IF1506"];
var forexTemplate = {
    //name:'@PICK(["美元 日圓","歐元 美元","英鎊 美元","美元 人民幣","倫敦金","倫敦銀"])',
    //"buying": '@FLOAT(118,120,5,5)',//IE8出來的數字會有問題
    "buying": function () {
        return JsonTool.formatFloat(JsonTool.random(118, 120), 5);
    },
    "selling": function () {
        return JsonTool.formatFloat(JsonTool.random(118, 120), 5);
    },
    "close": function () {
        return JsonTool.formatFloat(JsonTool.random(118, 120), 5);
    },
    "buyChange": function () {
        return JsonTool.formatFloat(this.buying - this.close, 4);
    },
    "sellChange": function () {
        return JsonTool.formatFloat(this.selling - this.close, 4);
    },
    spread: function () {
        return JsonTool.formatFloat(this.buying - this.selling, 2);
    },
    "valueMax": function () {
        return JsonTool.formatFloat(this.close * 1.1, 4);
    },
    "valueMin": function () {
        return JsonTool.formatFloat(this.close * 0.9, 4);
    },
    "volumeMin": 0,
    "volumeMax": 2500
};
var stockTemplate = {
    "buying": function () {
        return JsonTool.formatFloat(JsonTool.random(5, 25), 4);
    },
    "selling": function () {
        return JsonTool.formatFloat(JsonTool.random(5, 25), 4);
    },

    "single|50-1500": 1,//'@INTEGER(50,1500)'
    "total|50-5000": 1,//'@INTEGER(150,5000)'

    //"opening": '@FLOAT(10,20,4,4)',
    "opening": function () {
        return JsonTool.formatFloat(JsonTool.random(10,20),4);
    },
    //
    "close": function () {
        return JsonTool.formatFloat(JsonTool.random(10,20),4);
    },
    "transaction": function () {
        return Random.float(this.opening * 0.9, this.opening * 1.1, 4, 4);
    },
    "change": function () {
        return JsonTool.formatFloat(this.transaction - this.close, 4);
    },//漲跌
    "changeRate": function () {
        return this.change / this.close;
        //return JsonTool.formatFloat(this.change/this.close,2);
    },//漲跌率
    "valueMax": function () {
        return JsonTool.formatFloat(this.close * 1.1, 4);
    },
    "valueMin": function () {
        return JsonTool.formatFloat(this.close * 0.9, 4);
    },
    "volumeMin": 0,
    "volumeMax": 2500
};

function generateValueList(forexData) {
    forexData.valueList = [];
    var time;
    var data = {};
    for (var hour = 9; hour < 15; hour++) {
        for (var moment = 0; moment < 60; moment++) {
            time = ((hour < 10) ? "0" + hour : hour) + "" +
            ((moment < 10) ? "0" + moment : moment);
            data = {};
            data.time = time;
            data.value = JsonTool.formatFloat(JsonTool.random(forexData.valueMin, forexData.valueMax), 2);
            data.volume = JsonTool.randomInt(forexData.volumeMin, forexData.volumeMax);
            //data.value = Random.float(min, max, 0, 4);
            if (data.value < forexData.valueMin) {//mock.js的隨機數有bug,有可能出現比min小的值
                console.log("error range:" + data.value);
            }
            forexData.valueList.push(data);
        }
    }
}