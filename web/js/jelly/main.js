/**
 * Created by user on 2015/4/28.
 */
var quote1;
var quote2;
var forexMetalData;
var stockData;
var logo;
var langSelect;
var currentLang = "";
var currentContentUrl = "";
var contentUrl = {
    index: "jelly/Index.html",
    menu1: "jelly/Introduction.html",
    menu2: "jelly/Catalog.html",
    menu3: "jelly/Charge.html",
    menu4: "jelly/Support.html",
    menu5: "jelly/Contact.html"
};
$(document).ready(function () {
    currentLang = $.browser.lang;
    currentContentUrl = contentUrl.index;
    init();
    loadContentUrl();
});

function loadContentUrl() {
    $(".content").load(currentContentUrl, contentLoad);
}

function contentLoad() {
    console.log("currentContentUrl=" + currentContentUrl);
    $(".bodyContainer").css("backgroundImage", "url('images/banner_bg.png')");//用load之後的css沒用,只好手動設
    if (currentContentUrl == contentUrl.index) {
        onIndexLoad();
    } else {

        //$(".subTitleHead").css("backgroundImage", "url('images/banner_bg.png')");//用load之後的css沒用,只好手動設
        switch (currentContentUrl) {
            case contentUrl.menu1:
                //$(".sbuTitleBg").css("backgroundImage", "url('images/sub_banner_01.png')");//用load之後的css沒用,只好手動設
                break;
        }
    }
    langSelect.val(currentLang).change();
}
function init() {
    logo = $(".logo");
    $(".menuItem").on("click", menuClick);
    logo.on("click", logoClick);
    langSelect = $("#langSelect");
    langSelect.change(function (e) {
        //console.log("Change:" + $(this).val());
        currentLang = $(this).val();
        changeLang(currentLang);
    });
}

function menuClick(e) {
    var menuItem = $(e.currentTarget);
    if(!menuItem.hasClass("menuDisable")){
        console.log("menuClick");
        $(".menuItem").addClass("menu").removeClass("menuDisable");
        menuItem.removeClass("menu");
        menuItem.addClass("menuDisable");
        var menuIndex = menuItem.parent().index();//div -parent--> li
        currentContentUrl = contentUrl["menu" + (menuIndex + 1)];
        loadContentUrl();
    }
}

function logoClick(e) {
    currentContentUrl = contentUrl.index;
    loadContentUrl();
}

function onIndexLoad() {

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
    var rowData = forexMetalData[0];
    generateValueList(rowData);
    runChart(rowData);
}

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