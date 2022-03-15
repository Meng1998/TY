"use strict";

/**
 * js扩展
 */
(function () {

    //启动时间
    const start_time = new Date();

    module.exports = function () {
        Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        String.prototype.toDate = function () {
            return new Date(this);
        };
        Date.prototype.differNow = function (unit) {
            var multiple = 1;
            var loop = true;
            var current = "second";
            while (loop) {
                switch (current) {
                    case "second":
                        todo(1000, "minute");
                        if (!loop) break;
                    case "minute":
                        todo(60, "hour");
                        if (!loop) break;
                    case "hour":
                        todo(60, "day");
                        if (!loop) break;
                    case "day":
                        todo(24, "");
                        if (!loop) break;
                    default:
                        loop = false;
                        break;
                }
            }
            var date = this;

            var differ_day = (date - Date.now()) / multiple;
            return Math.abs(differ_day);

            function todo(num, next) {
                multiple = multiple * num;
                if (current === unit) { loop = false; }
                current = next;
            }
        };
        Date.prototype.startTime = function () {
            return start_time;
        }
    }
})();