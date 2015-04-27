/**
 * Created by user on 2015/4/27.
 */
var quote1;
var quote2;
var forexMetalData;
var stockData;
var langSelect;
$(document).ready(function () {
    quote1 = DragTable.createNew("quote1");
    quote2 = DragTable.createNew("quote2");
    forexMetalData = generateForexData();
    stockData = generateStockData();
    quote1.setDataSource(forexMetalData);
    quote2.setDataSource(stockData);

    if (document.createElement('canvas').getContext) {//support canvas
        $(document).on("rowClick", tableRowClick);
        rangeChartInit("value", "volume", "time");
    } else {
        $(".quoteContainer").css("width", "960px");
        $(".quoteItem").css("width", "479px");
        $(".canvasContainer").hide();
        $(".oddEven>tbody>tr:odd").addClass("oddTr");
        $(".oddEven>tbody>tr:even").addClass("evenTr");
    }

    langSelect = $("#langSelect");
    langSelect.change(function (e) {
        console.log("Change:" + $(this).val());
        changeLang($(this).val());
    });
    langSelect.val($.browser.lang).change();
//            go();
});

function changeLang(lang) {
    var option = {resGetPath: "locales/" + lang + "/jelly.json"};
    i18n.init(option, function (t) {
        $(".container").i18n();
    });
}

function tableRowClick(e, tableClass, rowIndex, rowData) {
    if (typeof(rowData.valueList) == "undefined") {
        generateValueList(rowData);
    }
    runChart(rowData);
}

function generateForexData(option) {
    var data = [];
    var temp;
    for (var i = 0; i < forexMetalName.length; i++) {
        temp = Mock.mock(forexTemplate);
        temp.name = forexMetalName[i];
        data.push(temp);
    }
    return data;
}

function generateStockData(option) {
    var data = [];
    var temp;
    for (var i = 0; i < stockName.length; i++) {
        temp = Mock.mock(stockTemplate);
        temp.name = stockName[i];
        data.push(temp);
    }
    return data;
}