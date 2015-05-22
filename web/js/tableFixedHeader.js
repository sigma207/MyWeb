/**
 * Created by user on 2015/4/20.
 */
var FixedHeader = {
    createNew: function (tableClass, scrollClass) {
        var fh = {};
        fh.table = $("." + tableClass);
        fh.tHead = fh.table.find("thead");
        fh.scroll = $("." + scrollClass);
        fh.tHeadHolder;
        fh.init = function () {
            fh.table.css("position", "relative");
            fh.scroll.on("scroll", function (e) {
                //fh.updatePosition();
            });

            $(window).resize(function () {
                fh.fixHeader();
            });

        };

        fh.fixHeader = function () {
            var thList = fh.tHead.find("tr").eq(0).children();
            var thHolderList = fh.tHeadHolder.find("tr").eq(0).children();
            /**
             * very important, make sure the two tHead have same width.
             * or tHead won't have enough width to put width of all tds.
             */
            //fh.tHead.css("width", fh.tHeadHolder.css("width"));//very important, make sure the two tHead have same width.
            //fh.tHead.css("height", fh.tHeadHolder.css("height"));//very important, make sure the two tHead have same width.
            var tr = fh.tHead.children().eq(0);
            var holderTr = fh.tHeadHolder.children().eq(0);

            fh.tHead.children().css("width",fh.tHeadHolder.children().css("width"));
            //fh.tHead.children().css("height",fh.tHeadHolder.children().css("height"));
            thList.each(function (index) {
                $(this).css("width", thHolderList.eq(index).css("width"));
                console.log(index+" "+$(this).css("width")+":"+thHolderList.eq(index).css("width"));
            });
            //tr.css("width", holderTr.css("width"));
            //fh.updatePosition();
        };

        /**
         * call this function when init and table set dataSource(column might change)
         */
        fh.createHolder = function () {
            fh.tHead.css("position", "static");

            if (typeof fh.tHeadHolder !== typeof undefined && fh.tHeadHolder !== false) {
                fh.tHeadHolder.remove();
            }

            fh.tHead.after("<thead class='tHeadHolder'>" + fh.tHead.html() + "</thead>");
            fh.tHeadHolder = $(".tHeadHolder");
            fh.tHead.css("position", "fixed");
            //var tr = fh.tHead.children().eq(0);
            //tr.css("position", "absolute");
        };

        fh.updatePosition = function () {
            var tHeadHeight = parseInt(fh.tHead.css("height"));
            var scrollTop = parseInt(fh.scroll.scrollTop());
            if (scrollTop > 0) {
                //if(position=="static")fh.tHead.css("position", "absolute");
                //fh.tHead.offset({top:(fh.scroll.offset().top)});
                //fh.tHead.css("top", (scrollTop - 1)+"px");
                fh.tHead.css("transform", "translate(0px," + (scrollTop - tHeadHeight - 1) + "px)");//only transform can support drag&down
            } else {
                //fh.tHead.css("position", "static");
                //fh.tHead.offset({top:(- tHeadHeight)});
                //fh.tHead.css("top", (- tHeadHeight)+"px");
                //fh.tHead.css("transform", "translate(0px," + (0) + "px)");//only transform can support drag&down
                fh.tHead.css("transform", "translate(0px," + (-tHeadHeight-1) + "px)");//only transform can support drag&down
            }
        };

        fh.init();
        return fh;
    }
};