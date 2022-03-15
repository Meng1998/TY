"use script";

/**
 * 扩展util方法
 */
layui.define("util", function (exports) {

    /**
     * 判断是否为空，为空返回 true 不为空返回false
     * @param {any} value 值
     */
    layui.util.isEmpty = function (value) {
        return ((value === undefined || value === null || value === "" || value === "undefined") ? true : false);
    }

    /**
     * 判断是否为空 为空返回 false 不为空返回true
     * @param {any} value 值
     */
    layui.util.isNotEmpty = function (value) {
        return ((value === undefined || value === null || value === "" || value === "undefined") ? false : true);
    }

    /**
     * 获取uuid
     * @param {boolean} upper 是否大写
     */
    layui.util.guid = function (upper) {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        //s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        if (upper) {
            uuid = uuid.toUpperCase();
        }
        return uuid;
    }

    /**
     * 判断是否为数组
     * @param {Array} arr 数组
     */
    layui.util.isArray = function (arr) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(arr);
        } else {
            return Object.prototype.toString.call(arr) === "[object Array]";
        }
    }

    /**
     * 判断是否为字符串
     * @param {String} str 字符串
     */
    layui.util.isString = function (str) {
        return (typeof str == 'string') && str.constructor == String;
    }

    /**
     * 判断是否为数字
     * @param {Number} obj 数字
     */
    layui.util.isNumber = function (num) {
        return (typeof obj == 'number') && obj.constructor == Number;
    }

    /**
     * 判断是否为日期
     * @param {Object} obj 日期
     */
    layui.util.isDate = function (obj) {
        return (typeof obj == 'object') && obj.constructor == Date;
    }

    /**
     * 判断是否为函数
     * @param {Function} obj 方法
     */
    layui.util.isFunction = function (obj) {
        return (typeof obj == 'function') && obj.constructor == Function;
    }

    /**
     * 判断是否对象
     * @param {Object} obj 对象
     */
    layui.util.isObject = function (obj) {
        return (typeof obj == 'object') && obj.constructor == Object;
    }

    /**
     * 克隆对象
     * @param {Object} obj 要复制的对象
     * @param {Array} removeKeys 移除属性
     * @returns 新对象
     */
    layui.util.clone = function (obj, removeKeys) {
        if (null == obj || "object" != typeof obj) return obj;

        if (removeKeys == null) removeKeys = ["_parent", "_class"];//排除一些不拷贝的属性

        // Handle Date
        if (layui.util.isDate(obj)) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (layui.util.isArray(obj)) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i], removeKeys);
            }
            return copy;
        }

        // Handle Object
        if (typeof obj === 'object') {
            var copy = {};
            for (var attr in obj) {
                if (typeof attr === 'function') continue;
                if (removeKeys.indexOf(attr) != -1) continue;

                if (obj.hasOwnProperty(attr))
                    copy[attr] = layui.util.clone(obj[attr], removeKeys);
            }
            return copy;
        }
        return obj;
    }

    exports("utilEx", layui.util);
});