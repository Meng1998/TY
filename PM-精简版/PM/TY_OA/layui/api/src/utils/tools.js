"use strict";

/**
 * tools工具类
 */
(function () {

    const md5 = require("./md5");
    const aes = require("./aes");
    const tree = require("./tree");
    const date = require("./date");
    const io = require("./io");

    /**
     * 判断是否为空，为空返回 true 不为空返回false
     * @param {object} value 值
     * @returns 返回当前值是否为空
     */
    function isEmpty(value) {
        return ((value === undefined || value === null || value === "" || value === "undefined") ? true : false);
    }

    /**
     * 判断是否为空 为空返回 false 不为空返回true
     * @param {object} value 值
     * @returns 返回当前值是否为不空
     */
    function isNotEmpty(value) {
        return ((value === undefined || value === null || value === "" || value === "undefined") ? false : true);
    }

    /**
     * 获取链接参数
     * @param {string} search 地址
     * @param {string} parameter 参数名
     */
    function getQueryString(search, parameter) {
        var reg = new RegExp("(^|&)" + parameter + "=([^&]*)(&|$)");
        var r = search.match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    /**
     * 获取uuid
     * @param {boolean} upper 是否大写
     */
    function uuid(upper) {
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
     * 格式化占位符
     * @param {string} str 需要格式化的字符串
     * @param {object} param 被替换的值
     */
    function placeholder(str, param) {
        if (isEmpty(str) || isEmpty(param)) {
            return str;
        }
        if (typeof (param) == "object") {
            for (var key in param) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
            }
            return str;
        } else {
            for (var i = 0; i < arguments.length; i++) {
                str = str.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
            }
            return str;
        }
    }

    /**
     * 获取数据类型
     * @param {any} data 传入参数
     * @example
     * [object Null] Null
     * [object Undefined] Undefined
     * [object Boolean] Boolean
     * [object String] String
     * [object Date] Date
     * [object Object] Object
     * [object Array] Array
     * [object Function] Function
     * [object Number] Number
     * @returns 数据类型
     */
    function dataType(data) {
        return Object.prototype.toString.call(data);
    }

    /**
     * 判断是否为Object
     * @param {object} obj Object
     */
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    /**
     * 判断是否为Number
     * @param {object} num Number
     */
    function isNumber(num) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(num) || regNeg.test(num)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为Boolean
     * @param {object} bool Boolean
     */
    function isBoolean(bool) {
        if (bool.toString().toUpperCase() === "TRUE" || bool.toString().toUpperCase() === "FALSE") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为json格式字符串
     * @param {string} str 
     */
    function isJsonData(str) {
        if (typeof str === "string") {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == "object" && obj) {
                    return true;
                } else {
                    return false;
                }

            } catch (e) {
                return false;
            }
        }
    }

    /**
     * 判断是否为base64数据格式
     * @param {string} str Base64字符串
     */
    function isBase64(str) {
        if (str.startsWith("data:image") != -1 && str.indexOf("base64") != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为数组
     */
    function isArray(arr) {
        return Object.prototype.toString.call(arr) == "[object Array]";
    }

    /**
     * 判断是否为日期格式
     * 日期格式：yyyy-MM-dd
     * @param {object} date 日期 
     */
    function isDate(date) {
        var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (isEmpty(result)) {
            return false;
        }
        var d = new Date(result[1], result[3] - 1, result[4]);
        return (d.getFullYear() == result[1] && d.getMonth() + 1 == result[3] && d.getDate() == result[4]);
    }

    /**
     * 判断是否为日期格式
     * 日期格式：yyyy-mm-dd hh:mm:ss
     * @param {string} str 日期时间
     */
    function isDateTime(datetime) {
        var result = datetime.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (isEmpty(result)) {
            return false;
        }
        var d = new Date(result[1], result[3] - 1, result[4], result[5], result[6], result[7]);
        return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4] && d.getHours() == result[5] && d.getMinutes() == result[6] && d.getSeconds() == result[7]);
    }

    /**
     * 判断是否为时间格式
     * @param {string} str 时间
     */
    function isTime(time) {
        var a = time.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
        if (isEmpty(result)) {
            return false;
        }
        if (a[1] >= 24 || a[3] >= 60 || a[4] >= 60) {
            return false
        }
        return true;
    }

    /**
     * 比较两个日期的大小
     * @param {date} date1 
     * @param {data} date2 
     */
    function compareDate(date1, date2) {
        return ((new Date(date1.replace(/-/g, "\/"))) < (new Date(date2.replace(/-/g, "\/"))));
    }

    /**
     * 
     * 查找数组，返回匹配到的第一个index
     * 
     * @param array 被查找的数组
     * @param feature 查找特征 或者为一个具体值，用于匹配数组遍历的值，或者为一个对象，表明所有希望被匹配的key-value
     * @param all boolean 希望命中feature全部特征或者只需命中一个特征，默认true
     * 
     * @return 数组下标  查找不到返回-1
     */
    function findArray(array, feature, all = true) {
        for (var index in array) {
            var cur = array[index];
            if (feature instanceof Object) {
                var allRight = true;
                for (var key in feature) {
                    var value = feature[key];
                    if (cur[key] == value && !all) return index;
                    if (all && cur[key] != value) {
                        allRight = false;
                        break;
                    }
                }
                if (allRight) return index;
            } else {
                if (cur == feature) {
                    return index;
                }
            }
        }
        return -1;
    }

    /**
     * 获取对象数据类型
     * @param {object} obj 传入对象
     */
    function getType(obj) {
        //tostring会返回对应不同的标签的构造函数
        var toString = Object.prototype.toString;
        var map = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regExp",
            "[object Undefined]": "undefined",
            "[object Null]": "null",
            "[object Object]": "object"
        };

        return map[toString.call(obj)];
    }

    /**
     * 克隆对象
     * @param {Object} obj 要复制的对象
     * @param {Array} removeKeys 移除属性
     * @returns 新对象
     */
    function deepClone(obj, removeKeys) {
        if (null == obj || "object" != typeof obj) return obj;

        if (removeKeys == null) removeKeys = ["_parent", "_class"];//排除一些不拷贝的属性

        // Handle Date
        if ((typeof obj == 'object') && obj.constructor == Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (isArray(obj)) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = deepClone(obj[i], removeKeys);
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
                    copy[attr] = deepClone(obj[attr], removeKeys);
            }
            return copy;
        }
        return obj;
    }

    /**
     * 生成随机数
     * @param {number} minNum 最小值
     * @param {number} maxNum 最大值
     */
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            default:
                return 0;
        }
    }

    /**
     * buffer数据转为字符串格式
     * @param {arraybuffer} buffer Buffer数组
     */
    function ab2Ascii(buffer) {
        var str = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return String.fromCharCode(bit);
            }
        )
        return str.join('');
    }

    module.exports.isEmpty = isEmpty;
    module.exports.isNotEmpty = isNotEmpty;
    module.exports.getQueryString = getQueryString;
    module.exports.uuid = uuid;
    module.exports.placeholder = placeholder;
    module.exports.dataType = dataType;
    module.exports.isObject = isObject;
    module.exports.isNumber = isNumber;
    module.exports.isBoolean = isBoolean;
    module.exports.isJsonData = isJsonData;
    module.exports.isBase64 = isBase64;
    module.exports.isArray = isArray;
    module.exports.isDate = isDate;
    module.exports.isDateTime = isDateTime;
    module.exports.isTime = isTime;
    module.exports.compareDate = compareDate;
    module.exports.findArray = findArray;
    module.exports.md5 = md5;
    module.exports.aes = aes;
    module.exports.tree = tree;
    module.exports.date = date;
    module.exports.io = io;
    module.exports.deepClone = deepClone;
    module.exports.randomNum = randomNum;
    module.exports.ab2Ascii = ab2Ascii;
})();  