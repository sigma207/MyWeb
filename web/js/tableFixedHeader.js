/**
 * Created by user on 2015/4/20.
 */
var tf = {
    fixedTHead: function (headClass,scrollerClass) {
        var tHead = $("."+headClass);
        var scroller = $("."+scrollerClass);

        fixHeader();

        scroller.on("scroll", function (e) {
            updatePosition();
        });

        $( window ).resize(function() {
            fixHeader();
        });

        function fixHeader(){
            //要修正resize bug..
            tHead.css("position","static");
            var headTr = tHead.find("tr").eq(0);
            var thList = headTr.children();
            var tHeadHolder = $(".tHeadHolder");
            /**
             * 如果table 的datasource改變 可能會讓欄位增加或減少
             * 此時要把tHeadHolder remover後再重建
             */
            tHeadHolder.remove();

            tHead.after("<thead class='tHeadHolder'>"+tHead.html()+"</thead>");


            thList.each(function(index){
                $(this).attr("originalWidth",$(this).css("width"));
            });

            tHead.css("position","absolute");

            thList.each(function(index){
                $(this).css("width",$(this).attr("originalWidth"));
            });
            updatePosition();
        }

        function updatePosition(){
            var tHeadHeight = parseInt(tHead.css("height"));
            var scrollTop = scroller.scrollTop();
            if(scrollTop>0){
                tHead.css("transform","translate(0px,"+(parseInt(scroller.scrollTop())-tHeadHeight-1)+"px)");//firefox chrome
            }else{
                tHead.css("transform","translate(0px,"+(-tHeadHeight)+"px)");//firefox chrome
            }
        }
    }
};