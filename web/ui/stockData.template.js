/**
 * Created by user on 2015/4/16.
 */
var stock = {
    "code": '@WORD(1)@INCREMENT',
    "name": '@NAME',
    "buying": '@FLOAT(5,25,4,4)',
    "selling": '@FLOAT(5,25,4,4)',
    "transaction": function () {
        return Random.float(this.opening*0.9,this.opening*1.1,4,4);
    },
    "single|50-1500": 1,//'@INTEGER(50,1500)'
    "total|50-5000": 1,//'@INTEGER(150,5000)'
    "change": function(){
        return JsonTool.formatFloat(this.transaction-this.close,4);
    },//º¦¶^
    "changeRate": function () {
        return this.change/this.close;
        //return JsonTool.formatFloat(this.change/this.close,2);
    },//º¦¶^²v
    "height": '@FLOAT(15,25,4,4)',
    "low": '@FLOAT(5,15,4,4)',
    "opening": '@FLOAT(10,20,4,4)',
    "close": '@FLOAT(10,20,4,4)',
    "BIDVOL": '@INTEGER(1,100)',
    "ASKVOL": '@INTEGER(1,100)',
    "date":'@NOW(yyyyMMdd)',
    "time":'@NOW(HHmmss)'
};