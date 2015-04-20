/**
 * Created by user on 2015/4/20.
 */
var FixedHeader = {
    createNew: function (tableClass,scrollClass) {
        var fh = {};
        fh.table = $("."+tableClass);
        fh.tHead = fh.table.find("thead");
        fh.scroll = $("."+scrollClass);
        fh.tHeadHolder;
        fh.init = function(){
            fh.scroll.on("scroll", function (e) {
                fh.updatePosition();
            });

            $( window ).resize(function() {
                fh.fixHeader();
            });

        };

        fh.fixHeader = function(){
            var thList = fh.tHead.find("tr").eq(0).children();
            var thHolderList = fh.tHeadHolder.find("tr").eq(0).children();
            /**
             * very important, make sure the two tHead have same width.
             * or tHead won't have enough width to put width of all tds.
             */
            fh.tHead.css("width",fh.tHeadHolder.css("width"));//very important, make sure the two tHead have same width.
            thList.each(function(index){
                $(this).css("width",thHolderList.eq(index).css("width"));
            });
            fh.updatePosition();
        };

        /**
         * call this function when init and table set dataSource(column might change)
         */
        fh.createHolder = function(){
            fh.tHead.css("position","static");
            if (typeof fh.tHeadHolder !== typeof undefined && fh.tHeadHolder !== false) {
                fh.tHeadHolder.remove();
            }

            fh.tHead.after("<thead class='tHeadHolder'>"+fh.tHead.html()+"</thead>");
            fh.tHeadHolder = $(".tHeadHolder");
            fh.tHead.css("position","absolute");
        };

        fh.updatePosition = function(){
            var tHeadHeight = parseInt(fh.tHead.css("height"));
            var scrollTop = parseInt(fh.scroll.scrollTop());
            if(scrollTop>0){
                fh.tHead.css("transform","translate(0px,"+(scrollTop-tHeadHeight-1)+"px)");
            }else{
                fh.tHead.css("transform","translate(0px,"+(-tHeadHeight)+"px)");
            }
        };

        fh.init();
        return fh;
    }
};