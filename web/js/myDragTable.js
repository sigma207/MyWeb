///**
// * Created by Sigma on 2015/4/11.
// */
//var DragTable = {
//    createNew: function () {
//        var dt = {};//dragTable
//        dt.$table = $(".dragTable");
//        dt.$tHead = dt.$table.find("thead>tr");
//        dt.$thArrowDiv;
//        dt.thList = [];//thObject物件的陣列
//        dt.dragOverColumnClass = "dragOverColumn";
//        dt.debug = true;
//        dt.eventLogEnable = false;
//        //dt.dragImgElement;
//        dt.dragIndex = -1;
//        dt.dropIndex = -1;
//        dt.data = [];
//        dt.dataSize = 0;
//        dt.columnSize = 0;
//        dt.columnFields = [];
//        dt.renderTBody = "";
//
//        dt.BASIC_TH_CLASS = "basicTH";
//        dt.ORDER_BY = "orderBy";
//        dt.COLUMN_TYPE = "type";
//        dt.FIELD = "field";
//        dt.TD_CLASS = "tdClass";
//        dt.ARROW_DIV = "arrowDiv";
//
//        dt.init = function () {
//            dt.initColumnField();
//            var $th;
//            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
//                $th = dt.getTh(colIndex);
//                if (typeof($th.attr(dt.COLUMN_TYPE)) == "undefined") {
//                    $th.attr(dt.COLUMN_TYPE, "text");
//                }
//                $th.attr(dt.ORDER_BY, "");
//                $th.addClass(dt.BASIC_TH_CLASS);
//                $th.append("<div class='"+dt.ARROW_DIV+"'></div>");
//                $th.on("click", dt.sortColumn);
//            }
//            dt.$thArrowDiv = dt.$tHead.find("th>."+dt.ARROW_DIV);
//            //drag&down event
//            var ch = dt.columnHead();
//            ch.attr("draggable", true);
//            ch.on("dragstart", dt.dragStart);
//            ch.on("dragenter", dt.dragEnter);
//            ch.on("dragleave", dt.dragLeave);
//            ch.on("dragover", dt.dragOver);
//            ch.on("dragend", dt.dragEnd);
//            ch.on("drop", dt.drop);
//        };
//
//        dt.initColumnField = function(){
//            var $th;
//            var ch = dt.columnHead();
//            dt.columnSize = ch.length;
//            dt.columnFields = [];
//            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
//                $th = dt.getTh(colIndex);
//                dt.columnFields.push($th.attr(dt.FIELD));
//            }
//        };
//
//        dt.thObject = function($th){
//            return {
//                "th": $th,
//                "type": $th.attr(dt.COLUMN_TYPE),
//                "field": $th.attr(dt.FIELD),
//                "orderBy": $th.attr(dt.ORDER_BY),
//                "display": $th.css("display"),
//                "arrowDiv": $th.find(dt.ARROW_DIV)
//            };
//        };
//
//        dt.refreshTh = function(){
//            dt.thList = [];
//            var ch = dt.columnHead();
//            ch.each(function(i){
//               dt.thList.push(dt.thObject($(this)));
//            });
//        };
//
//        dt.columnHead = function(){
//            return dt.$tHead.children();
//        };
//
//        dt.setDataSource = function (newData) {
//            dt.data = newData;
//            dt.dataSize = dt.data.length;
//            dt.renderDom();
//        };
//
//        dt.getTh = function (index) {
//            return dt.columnHead().eq(index);
//        };
//
//        dt.getColumn = function (index) {
//            return dt.$table.find("tr>th:nth-child(" + (index + 1) + "), tr>td:nth-child(" + (index + 1) + ")");
//        };
//
//        /**
//         * ------------------------------------------------------------------
//         * Operate Column
//         * ------------------------------------------------------------------
//         */
//        dt.swapColumn = function () {
//            if (dt.dropIndex != dt.dragIndex) {
//                var $dragColumn = dt.getColumn(dt.dragIndex);
//                var $dropColumn = dt.getColumn(dt.dropIndex);
//                $dragColumn.each(function (i) {
//                    DomTool.swapElements($(this)[0], $dropColumn.get(i));
//                });
//                dt.initColumnField();
//            }
//        };
//
//        dt.sortColumn = function (e) {
//            var ch = dt.columnHead();
//            var colIndex = $(this).index();
//            var $th = dt.getTh(colIndex);
//            var type = $th.attr(dt.COLUMN_TYPE);
//            var field = $th.attr(dt.FIELD);
//            var orderBy = $th.attr(dt.ORDER_BY);
//            var arrowDiv = $th.find("."+dt.ARROW_DIV);
//            //remove all arrow class
//            dt.$thArrowDiv.removeClass("descArrow");
//            dt.$thArrowDiv.removeClass("ascArrow");
//
//            if (orderBy == "desc" || orderBy == "") {
//                orderBy = "asc";
//                arrowDiv.addClass("ascArrow");
//            } else {
//                orderBy = "desc";
//                arrowDiv.addClass("descArrow");
//            }
//            $th.attr(dt.ORDER_BY, orderBy);
//            if (type == "number") {
//                JsonTool.sort(dt.data, field, orderBy);
//            } else {
//                JsonTool.sortString(dt.data, field, orderBy);
//            }
//            dt.renderDom();
//        };
//        /**
//         * ------------------------------------------------------------------
//         * Render TBody
//         * ------------------------------------------------------------------
//         */
//        dt.renderDom = function () {
//            console.time("renderDom");
//            dt.refreshTh();//刷新ths的暫存
//            dt.renderTBody = "";
//            for (var rowIndex = 0; rowIndex < dt.dataSize; rowIndex++) {
//                dt.renderTBody += dt.generateTR(rowIndex);
//            }
//            dt.$table.find("tbody").html(dt.renderTBody);
//            console.timeEnd("renderDom");
//        };
//
//        dt.generateTR = function (rowIndex) {
//            var tr = "<tr>";
//            var value;
//            var thObj;
//            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
//                thObj = dt.thList[colIndex];
//                value = dt.data[rowIndex][thObj.field];
//                tr += dt.generateTD(thObj, colIndex, value);
//            }
//            tr += "</tr>";
//            return tr;
//        };
//
//        /**
//         *
//         * @param thObj(thObject) 從暫存取出以減少dom操作的耗損
//         * @param colIndex
//         * @param value
//         * @returns {string}
//         */
//        dt.generateTD = function (thObj, colIndex, value) {
//            var td = "<td";
//            var tdClass = "";
//
//            if (thObj[dt.COLUMN_TYPE] == "number") {
//                tdClass += "numberTD";
//            } else {
//                tdClass += "baseTD";
//            }
//            var externalClass = thObj[dt.TD_CLASS];
//            if (typeof externalClass !== typeof undefined && externalClass !== false) {
//                tdClass += " " + externalClass;
//            }
//            if (tdClass.trim() != "") {
//                td += " class='" + tdClass + "'";
//            }
//            if(thObj.display=="none"){
//                td += " style='display:none'";
//            }
//            td += ">" + value + "</td>";
//            return td;
//        };
//        /**
//         * ------------------------------------------------------------------
//         * Drag&Down
//         * ------------------------------------------------------------------
//         */
//        dt.dragStart = function (e) {
//            dt.eventLog("dragStart");
//            dt.dragIndex = $(this).index();
//            e.originalEvent.dataTransfer.setData("text/plain", "anything");
//
//            //dt.dragImgElement = e.originalEvent.target.cloneNode(true);
//            //dt.dragImgElement.style.backgroundColor = "red";
//            //dt.dragImgElement.style.position = "absolute"; dt.dragImgElement.style.top = "0px"; dt.dragImgElement.style.right = "0px";
//            //document.body.appendChild(dt.dragImgElement);
//            //e.originalEvent.dataTransfer.setDragImage(dt.dragImgElement, 0, 0);
//
//            e.originalEvent.target.style.opacity = "0.4";
//        };
//
//        dt.dragEnter = function (e) {
//            dt.eventLog("dragEnter");
//            $(this).addClass(dt.dragOverColumnClass);
//        };
//
//        dt.dragLeave = function (e) {
//            dt.eventLog("dragLeave");
//            $(this).removeClass(dt.dragOverColumnClass);
//        };
//
//        dt.dragOver = function (e) {
//            e.preventDefault();
//            e.originalEvent.dataTransfer.dropEffect = "move";
//            return false;
//        };
//
//        dt.dragEnd = function (e) {
//            dt.eventLog("dragEnd");
//            //原本放在dr.drop(),但如果drop在th以外的地方就不會觸發drop
//            dt.columnHead().removeClass(dt.dragOverColumnClass);
//            dt.columnHead().css("opacity", "1");
//            //document.body.removeChild(dt.dragImgElement);
//        };
//
//        dt.drop = function (e) {
//            dt.eventLog("drop");
//            e.preventDefault();
//            dt.dropIndex = $(this).index();
//            dt.swapColumn();
//            return false;
//        };
//        /**
//         * ------------------------------------------------------------------
//         * Show&Hide column
//         * ------------------------------------------------------------------
//         */
//        dt.hideColumn = function (index) {
//            if (index < dt.columnSize) {
//                dt.getColumn(index).hide();
//            }
//        };
//
//        dt.showColumn = function (index) {
//            if (index < dt.columnSize) {
//                dt.getColumn(index).show();
//            }
//        };
//
//        /**
//         * ------------------------------------------------------------------
//         * Log
//         * ------------------------------------------------------------------
//         */
//        dt.eventLog = function (msg) {
//            if (dt.eventLogEnable)
//                dt.log(msg);
//        };
//
//        dt.log = function (msg) {
//            if (dt.debug)
//                console.log("dragTable log:" + msg);
//        };
//
//        dt.init();
//        return dt;
//    }
//};