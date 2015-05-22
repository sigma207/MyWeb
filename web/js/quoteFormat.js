/**
 * Created by user on 2015/5/21.
 */
var quoteBateCode = [
    [",", "bid6", "委買價6"],
    ["-", "bid7", "委買價7"],
    [".", "bid8", "委買價8"],
    ["/", "bid9", "委買價9"],
    ["0", "bid10", "委買價10"],
    ["1", "bidVolume6", "委買量6"],
    ["2", "bidVolume7", "委買量7"],
    ["3", "bidVolume8", "委買量8"],
    ["4", "bidVolume9", "委買量9"],
    ["5", "bidVolume10", "委買量10"],
    ["6", "ask6", "委賣價6"],
    ["7", "ask7", "委賣價7"],
    ["8", "ask8", "委賣價8"],
    ["9", "ask9", "委賣價9"],
    [":", "ask10", "委賣價10"],
    [";", "askVolume6", "委賣量6"],
    ["<", "askVolume7", "委賣量7"],
    [">", "askVolume8", "委賣量8"],
    ["?", "askVolume9", "委賣量9"],
    ["@", "askVolume10", "委賣量10"],
    ["A", "tickTime", "成交時間"],//成交時間
    ["B", "scale", "小數點"],//小數點
    ["C", "last", "成交價"],//成交價
    ["D", "bid", "委買價"],//委買價
    ["E", "ask", "委賣價"],//委賣價
    ["F", "totalVolume", "總量"],//總量
    ["G", "high", "最高價"],//最高價
    ["H", "low", "最低價"],//最低價
    ["I", "open", "開盤價"],
    ["J", "close", "收價價"],
    ["K", "netChange", "於上一價漲跌"],
    ["L", "preClose", "昨收"],
    ["M", "oi", "未平倉量"],
    ["N", "upDown", "漲跌"],
    ["O", "upDownPercentage", "漲跌幅"],
    ["P", "volume", "單量"],
    ["Q", "quoteIndex", "報價索引"],
    ["R", "", ""],
    ["S", "type", "E=股票;W=權證;F=期貨;X=外匯;O=選擇權"],
    ["T", "status", "T=正常交易; P=暫停交易; O=零股交易; U=已下市; A=盤後交易;  R=盤前交易"],
    ["U", "settlementPrice", "結算價"],
    ["V", "highLimit", "漲停價"],
    ["W", "lowLimit", "跌停價"],
    ["X", "preDayVolume", "昨量"],
    ["Y", "volumePreW", "成交價量"],
    ["Z", "bidVolume", "委買量"],
    ["[", "askVolume", "委賣量"],
    ["\\", "tradeDate", "本交易日"],
    ["]", "expireDate", "期貨到期日"],
    ["^", "strikePrice", "履約價"],
    ["_", "chineseName", "中文名"],
    ["`", "quoteDate", "報價日期"],
    ["a", "bid2", "委買價2"],
    ["b", "bid3", "委買價3"],
    ["c", "bid4", "委買價4"],
    ["d", "bid5", "委買價5"],
    ["e", "bidVolume2", "委買量2"],
    ["f", "bidVolume3", "委買量3"],
    ["g", "bidVolume4", "委買量4"],
    ["h", "bidVolume5", "委買量5"],
    ["i", "ask2", "委賣價2"],
    ["j", "ask3", "委賣價3"],
    ["k", "ask4", "委賣價4"],
    ["l", "ask5", "委賣價5"],
    ["m", "askVolume2", "委賣量2"],
    ["n", "askVolume3", "委賣量3"],
    ["o", "askVolume4", "委賣量4"],
    ["p", "askVolume5", "委賣量4"],
    ["q", "monthCode", "月份碼"],
    ["r", "settlementDay", "結算日"]
];

function quoteFormat(data) {
    console.log(data);
    var firstCommaIndex = data.indexOf(",");
    var code = data.substring(0, firstCommaIndex);
    console.log("code=%s", code);
    var str = data.substring(firstCommaIndex + 1);
    var count = quoteBateCode.length;
    var obj = {};
    var bateCode = null;
    var keyIndex = -1;
    var endIndex = -1;
    var key = null;
    //while(str.length>0){
    //    key = str.substr(0,1);
    //
    //}
    console.time("quoteFormat");
    for (var i = 0; i < count; i++) {
        bateCode = quoteBateCode[i];
        keyIndex = str.indexOf(bateCode[0]);
        if (keyIndex == 0) {
            endIndex = str.indexOf(",");
            obj[bateCode[1]] = str.substring(keyIndex + 1, endIndex);
            str = str.substring(endIndex + 1);
            console.log(str);
        } else {

        }
        console.timeEnd("quoteFormat");
        //console.log(str);
    }
    console.log(obj);
}

function QuoteData(name, value, describe) {
    this.name = name;
    this.value = value;
    this.describe = describe;
}