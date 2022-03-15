"use script";

/**
 * 扩展基础对象方法
 */
layui.define(function (exports) {

    /**
     * 整型方法扩展
     */
    function NumberEx() {
        /**
         * 毫秒数转日期
         * @param {string} format 时间格式
         */
        Number.prototype.toDate = function (format) {
            format = format ? format : "yyyy-MM-dd hh:mm:ss";
            return (new Date(this)).format(format);
        }
    }

    /**
     * 字符串方法扩展
     */
    function StringEx() {
        /**
         * 格林威治时间转北京时间
         */
        String.prototype.UTCToBeiJing = function (format = "yyyy-MM-dd hh:mm:ss") {
            var value = this;
            var T_pos = value.indexOf('T');
            var Z_pos = value.indexOf('Z');
            var year_month_day = value.substr(0, T_pos);
            var hour_minute_second = value.substr(T_pos + 1, Z_pos - T_pos - 1);
            var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

            // 处理成为时间戳
            timestamp = new Date(Date.parse(new_datetime));
            timestamp = timestamp.getTime();
            timestamp = timestamp / 1000;

            // 增加8个小时，北京时间比utc时间多八个时区
            var timestamp = timestamp + 8 * 60 * 60;

            // 时间戳转为时间
            var beijing_datetime = new Date(parseInt(timestamp) * 1000).format(format);
            return beijing_datetime; // 2017-03-31 16:02:06
        }

        /**
         * 相差天数
         */
        String.prototype.DifferDay = function () {
            var value = this;
            var date = Date.parse(value);
            var differ_day = (date - Date.now()) / (1000 * 60 * 60 * 24);
            return Math.abs(differ_day);
        }

        /**
         * 字符串转日期
         * @param {string} format 时间格式
         */
        String.prototype.toDate = function (format) {
            format = format ? format : "yyyy-MM-dd hh:mm:ss";
            return (new Date(this)).format(format);
        }
    }

    /**
     * 数组方法扩展
     */
    function ArrayEx() {
        /** */
        Array.prototype.remove = function (obj, field) {
            if (isNaN(obj) || obj > this.length) {
                return false;
            }

            for (var i = 0, n = 0; i < this.length; i++) {
                //判断是否为对象
                if ((typeof obj == 'object') && obj.constructor == Object) {
                    if (this[i][field] != this[obj][field]) {
                        this[n++] = this[i];
                    }
                } else {
                    if (this[i] != this[obj]) {
                        this[n++] = this[i];
                    }
                }
            }
            this.length -= 1;
        };
    }

    /**
     * 时间格式扩展
     */
    function DateEx() {
        /**
         * 时间格式化
         * @param {string} format 时间格式
         */
        Date.prototype.format = function (format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        }

        Date.prototype.UTCToBeiJing = function (date) {

        }
    }

    var extend = {
        init() {
            NumberEx();
            StringEx();
            ArrayEx();
            DateEx();
        }
    }

    extend.init();

    exports("prototypeEx", extend);
});
