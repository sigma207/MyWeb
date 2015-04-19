/**
 * Created by user on 2015/4/15.
 */
var DomTool = {
    /**
     * http://stackoverflow.com/questions/8034918/jquery-switch-elements-in-dom
     * pure dom element swap
     * @param elm1
     * @param elm2
     */
    swapElements: function (elm1, elm2) {
        var parent1, next1,
            parent2, next2;

        parent1 = elm1.parentNode;
        next1 = elm1.nextSibling;
        parent2 = elm2.parentNode;
        next2 = elm2.nextSibling;

        parent1.insertBefore(elm2, next1);
        parent2.insertBefore(elm1, next2);
    }
};