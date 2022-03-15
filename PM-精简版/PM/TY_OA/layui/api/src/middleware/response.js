"use strict";

/**
 * Response数据封装
 */
(function () {
    /**
     * 成功
     * @param {object} data 返回数据
     */
    function success(data) {
        return {
            code: 0,
            msg: "success",
            data: data
        };
    }

    /**
     * 错误
     * @param {number} code 错误码
     * @param {string} msg 错误信息
     */
    function error(code, msg) {
        if (!msg && !code) {
            code = 1;
            msg = "error";
        }
        return {
            code: code,
            msg: msg,
            data: null
        };
    }

    /**
     * webapi接口返回的数据格式
     * @param {object} result 
     */
    function jsonData(result) {
        var data = null;
        if (result.success) {
            data = success(result.data);
        } else {
            data = error(result.code, result.msg);
        }
        return data;
    }

    module.exports.jsonData = jsonData;
})();