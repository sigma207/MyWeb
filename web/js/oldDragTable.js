///**
// * Created by user on 2015/4/15.
// */
///**
// * Created by Sigma on 2015/4/11.
// */
//var DragTable = {
//    createNew: function () {
//        var dt = {};//dragTable
//        dt.$table = $(".dragTable");
//        dt.$columnHeader = dt.$table.find("th");
//        dt.dragOverColumnClass = "dragOverColumn";
//        dt.debug = true;
//        dt.eventLogEnable = false;
//        dt.dragIndex = -1;
//        dt.dropIndex = -1;
//        dt.data;
//        dt.dataSize = 0;
//        dt.columnSize = 0;
//        dt.columnFields = [];
//        dt.tdClass = [];
//        dt.renderTBody = "";
//
//        dt.ORDER_BY = "orderBy";
//        dt.COLUMN_TYPE = "type";
//        dt.FIELD = "field";
//
//        dt.init = function () {
//            dt.log("init");
//            dt.columnSize = dt.$columnHeader.length;
//            var $th;
//            var tdClass;
//            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
//                $th = dt.$columnHeader.eq(colIndex);
//                if (typeof($th.attr(dt.COLUMN_TYPE)) == "undefined") {
//                    $th.attr(dt.COLUMN_TYPE, "text");
//                }
//                tdClass = $th.attr('tdClass');
//                if (typeof tdClass !== typeof undefined && tdClass !== false) {
//                    dt.tdClass.push(tdClass);
//                } else {
//                    dt.tdClass.push("");
//                }
//                $th.attr(dt.ORDER_BY, "");
//                //console.log($th.attr("type"));
//                dt.columnFields.push($th.attr(dt.FIELD));
//                $th.on("click", dt.sortColumn);
//            }
//        };
//
//        dt.getTh = function (index) {
//            return dt.$columnHeader.eq(index);
//        };
//
//        dt.sortColumn = function (e) {
//            var $th = dt.getTh($(this).index());
//            var type = $th.attr(dt.COLUMN_TYPE);
//            var field = $th.attr(dt.FIELD);
//            var orderBy = $th.attr(dt.ORDER_BY);
//            if (orderBy == "desc" || orderBy == "") {
//                orderBy = "asc";
//            } else {
//                orderBy = "desc";
//            }
//            $th.attr(dt.ORDER_BY, orderBy);
//            if (type == "number") {
//                JsonTool.sort(dt.data, field, orderBy);
//            } else {
//                JsonTool.sortString(dt.data, field, orderBy);
//            }
//
//            //console.table(dt.data);
//            dt.render();
//        };
//
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
//        /**
//         * ------------------------------------------------------------------
//         * Drag&Down
//         * ------------------------------------------------------------------
//         */
//        dt.dragStart = function (e) {
//            dt.eventLog("dragStart");
//            dt.dragIndex = $(this).index();
//            e.originalEvent.dataTransfer.setData("text/plain", "anything");
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
//            dt.$columnHeader.removeClass(dt.dragOverColumnClass);
//            dt.$columnHeader.css("opacity", "1");
//        };
//
//        dt.drop = function (e) {
//            dt.eventLog("drop");
//            e.preventDefault();
//            dt.dropIndex = $(this).index();
//            dt.swapColumn();
//            return false;
//        };
//
//        dt.getColumn = function (index) {
//            return dt.$table.find("tr>th:nth-child(" + (index + 1) + "), tr>td:nth-child(" + (index + 1) + ")");
//        };
//
//        dt.swapColumn = function () {
//            if (dt.dropIndex != dt.dragIndex) {
//                var $dragColumn = dt.getColumn(dt.dragIndex);
//                var $dropColumn = dt.getColumn(dt.dropIndex);
//                $dragColumn.each(function (i) {
//                    //console.log(i+"="+ $dropColumn.eq(i).html()+":"+$(this).html());
//                    swapElements($(this)[0], $dropColumn.get(i));
//                });
//            }
//        };
//
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
//        dt.setDataSource = function (newData) {
//            dt.data = newData;
//            dt.dataSize = dt.data.length;
//            //dt.refresh();
//            dt.render();
//        };
//
//        dt.render = function () {
//            console.time("render");
//            dt.renderTBody = "";
//            for (var rowIndex = 0; rowIndex < dt.dataSize; rowIndex++) {
//                dt.renderTBody += dt.renderTR(rowIndex);
//            }
//            //console.log(dt.renderTBody);
//            dt.$table.find("tbody").html(dt.renderTBody);
//            console.timeEnd("render");
//        };
//
//        dt.renderTR = function (rowIndex) {
//            var tr = "<tr>";
//            var value;
//            var externalClass = "";
//
//            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
//                value = dt.data[rowIndex][dt.columnFields[colIndex]];
//                externalClass = dt.tdClass[colIndex];
//                tr += dt.renderTD(dt.$columnHeader.eq(colIndex), colIndex, value, externalClass);
//            }
//            tr += "</tr>";
//            return tr;
//        };
//
//        dt.renderTD = function ($th, colIndex, value, externalClass) {
//            var td = "<td";
//            var tdClass = "";
//
//            if ($th.attr("type") == "number") {
//                tdClass += "numberTD";
//            } else {
//                tdClass += "baseTD";
//            }
//            tdClass += " " + externalClass;
//            if (tdClass.trim() != "") {
//                td += " class='" + tdClass + "'";
//            }
//            td += ">" + value + "</td>";
//            return td;
//        };
//
//        dt.refresh = function () {
//            console.time("refresh");
//            dt.generateTR();
//            var $trs = dt.$table.find("tbody").children("tr");
//            var $tr;
//            var value;
//            var tdClass;
//            for (var rowIndex = 0; rowIndex < dt.dataSize; rowIndex++) {
//                $tr = $trs.eq(rowIndex);
//                for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
//                    value = dt.data[rowIndex][dt.columnFields[colIndex]];
//                    tdClass = dt.tdClass[colIndex];
//                    dt.tdContent(dt.$columnHeader.eq(colIndex), $tr.children().eq(colIndex), tdClass, value);
//                }
//            }
//            console.timeEnd("refresh");
//        };
//
//        dt.tdContent = function ($th, $td, tdClass, value) {
//            if ($th.attr("type") == "number") {
//                $td.addClass("numberTD");
//            } else {
//                $td.addClass("baseTD");
//            }
//            $td.addClass(tdClass);
//            $td.html(value);
//        };
//
//        dt.generateTR = function () {
//            var $tbody = dt.$table.find("tbody");
//            var trSize = $tbody.children().length;
//            if (dt.dataSize > trSize) {
//
//                var appendCount = dt.dataSize - trSize;
//                var $tr;
//                for (var i = 0; i < appendCount; i++) {
//                    $tr = $("<tr>");
//                    $tbody.append($tr);
//                    dt.generateTD($tr);//這邊有空可以改成一次appened所有tr和td
//                }
//            } else if (dt.dataSize < trSize) {//remove多餘的tr
//                $tbody.children().slice(dt.dataSize).remove();
//            }
//        };
//
//        dt.generateTD = function ($tr) {
//            var appendTd = "";
//            for (var i = 0; i < dt.columnSize; i++) {
//                appendTd += "<td>";
//            }
//            $tr.append(appendTd);
//        };
//
//        dt.$columnHeader.attr("draggable", true);
//        dt.$columnHeader.on("dragstart", dt.dragStart);
//        dt.$columnHeader.on("dragenter", dt.dragEnter);
//        dt.$columnHeader.on("dragleave", dt.dragLeave);
//        dt.$columnHeader.on("dragover", dt.dragOver);
//        dt.$columnHeader.on("dragend", dt.dragEnd);
//        dt.$columnHeader.on("drop", dt.drop);
//
//        dt.init();
//
//        //dt.hideColumn(2);
//        return dt;
//    }
//};
//
///**
// * http://stackoverflow.com/questions/8034918/jquery-switch-elements-in-dom
// * pure dom element swap
// * @param elm1
// * @param elm2
// */
//function swapElements(elm1, elm2) {
//    var parent1, next1,
//        parent2, next2;
//
//    parent1 = elm1.parentNode;
//    next1 = elm1.nextSibling;
//    parent2 = elm2.parentNode;
//    next2 = elm2.nextSibling;
//
//    parent1.insertBefore(elm2, next1);
//    parent2.insertBefore(elm1, next2);
//}
