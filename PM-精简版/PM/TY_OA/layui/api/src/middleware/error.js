"use strict";

/**
 * 错误代码
 */
(function () {
    const tools = require("../utils/tools");

    /**
     * 设置错误代码
     * @param {object} result 返回结果
     * @param {object} error 错误代码
     * @param {object} format 错误信息格式
     */
    function setError(result, error, format) {
        result.code = error.code;
        if (tools.isNotEmpty(format) && typeof format === "object") {
            format.param.unshift(error.description);
            result.msg = tools.placeholder(format.msg, format.param);
        } else {
            result.msg = error.description;
        }
        return result;
    }

    module.exports = {
        //--------------------------------API通用返回码------------------------------
        /**
         * 成功
         */
        SUCCESS: { code: 0, description: "Success" },
        /**
         * 未知错误
         */
        UNKNOWN_ERROR: { code: 1, description: "Unknown error" },
        /**
         * 无效的数据
         */
        INVALID_DATA: { code: 3, description: "Invalid data" },
        /**
         * 非法的请求参数
         */
        INVALID_PARAMETER: { code: 4, description: "Invalid parameter" },
        /**
         * 外键约束
         */
        FOREIGN_KEY_CONSTRAINT: { code: 5, description: "Foreign key constraint" },
        /**
         * 文件未找到
         */
        FILE_UNDEFINED: { code: 6, description: "File undefined" },
        //----------------------------------系统业务--------------------------------
        /**
         * 父节点
         */
        PARENT_NODE: { code: 10001, description: "Parent node" }
    }

    module.exports.setError = setError;
})()