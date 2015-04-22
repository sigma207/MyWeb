/**
 * Created by user on 2015/4/15.
 */
var JsonTool = {
    sortString: function (json, property, order) {
        json.sort(function (a, b) {
            if (order == "" || order == "asc") {
                return a[property].localeCompare(b[property]);
            } else {
                return b[property].localeCompare(a[property]);
            }
        });
    },
    sort: function (json, property, order) {
        json.sort(function (a, b) {
            if (order == "" || order == "asc") {
                return a[property] - b[property];
            } else {
                return b[property] - a[property];
            }
        });
    },
    formatFloat: function (num, pos) {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    },
    random: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};