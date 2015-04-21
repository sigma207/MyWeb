/**
 * Created by user on 2015/4/21.
 */
var forexName = ["美元 日圓","歐元 美元","英鎊 美元","美元 人民幣"];
var metalName = ["倫敦金","倫敦銀"];
var forexMetalName = forexName.concat(metalName);
var stockName = ["浦發銀行","白雲機場","武鋼股份","東風汽車","IF1505","IF1506"];
var forex = {
    //name:'@PICK(["美元 日圓","歐元 美元","英鎊 美元","美元 人民幣","倫敦金","倫敦銀"])',
    "buying":'@FLOAT(118,120,5,5)',
    "selling":'@FLOAT(118,120,5,5)',
    "close": '@FLOAT(118,120,5,5)',
    "buyChange": function(){
        return JsonTool.formatFloat(this.buying-this.close,4);
    },
    "sellChange": function(){
        return JsonTool.formatFloat(this.selling-this.close,4);
    },
    spread:function(){
        return JsonTool.formatFloat(this.buying-this.selling,2);
    }
};
var stock = {
    "buying": '@FLOAT(5,25,4,4)',
    "selling": '@FLOAT(5,25,4,4)',
    "transaction": function () {
        return Random.float(this.opening*0.9,this.opening*1.1,4,4);
    },
    "single|50-1500": 1,//'@INTEGER(50,1500)'
    "total|50-5000": 1,//'@INTEGER(150,5000)'
    "change": function(){
        return JsonTool.formatFloat(this.transaction-this.close,4);
    },//漲跌
    "changeRate": function () {
        return this.change/this.close;
        //return JsonTool.formatFloat(this.change/this.close,2);
    },//漲跌率
    "opening": '@FLOAT(10,20,4,4)',
    "close": '@FLOAT(10,20,4,4)'
};