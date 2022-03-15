"use strict";

/**
 * 数据验证类
 */
(function () {

    const tools = require("../utils/tools");
    const error = require("./error");

    /**
     * 对象类型
     */
    const OBJECT = "OBJECT";

    /**
     * 数字类型
     */
    const NUMBER = "NUMBER";

    /**
     * 布尔类型
     */
    const BOOLEAN = "BOOLEAN";

    /**
     * 字符串类型
     */
    const STRING = "STRING";

    /**
     * 文本类型
     */
    const TEXT = "TEXT";

    /**
     * json格式类型
     */
    const JSONDATA = "JSONDATA";

    /**
     * 日期类型，包含时间
     */
    const DATETIME = "DATETIME";

    /**
     * 日期类型，不包含时间
     */
    const DATE = "DATE";

    /**
     * 数组类型
     */
    const ARRAY = "ARRAY";

    /**
     * base64格式
     */
    const BASE64 = "BASE64";

    /**
     * 方法类型
     */
    const FUNCTION = "function";

    /**
     * 判断参数是否为数组
     * @param {array} arr 传入参数
     * @example
     * const retry = require("../middleware/retry");
     * var result = verify.isArray(options);
     */
    function isArray(arr) {
        //返回结果
        var result = {
            success: true,
            code: 0,
            msg: ""
        }
        if (!tools.isArray(arr)) {
            result.success = false;
            result = error.setError(result, error.INVALID_PARAMETER, {
                msg: "{0}: {1} is not array!",
                param: ["body"]
            });
        }
        return result;
    }

    /**
     * 验证数据
     * 对数据进行非空及类型验证
     * @param {Object} [data] 需要验证的数据
     * @param {array|object} [property={}] 数据属性
     * @param {string} [property.name] 数据属性
     * @param {string} [property.type] 数据类型
     * @param {boolean} [property.allowNull] 允许为空
     * @example
     * const retry = require("../middleware/retry");
     * var result = verify.execute(options, [
     *     {
     *         name: "string_field",
     *         type: verify.STRING,
     *         allowNull: true
     *     },
     *     {
     *         name: "number_field",
     *         type: verify.NUMBER
     *     }
     * ]);
     * 
     * @example
     * const retry = require("../middleware/retry");
     * var verifyData = new verify.verifyData({
     *     string_data: verify.STRING,
     *     number_data: verify.NUMBER,
     *     boolean_data: verify.BOOLEAN,
     *     text_data: {
     *         type: verify.STRING,
     *         allowNull: true
     *     }
     * });
     * var result = verify.execute(options, verifyData);
     * 
     * @example
     * const retry = require("../middleware/retry");
     * var result = verify.execute(options, {
     *     string_data: verify.STRING,
     *     number_data: verify.NUMBER,
     *     boolean_data: verify.BOOLEAN,
     *     text_data: {
     *         type: verify.STRING,
     *         allowNull: true
     *     }
     * });
     */
    function execute(data, property) {
        if (tools.isObject(property)) {
            if (!property.hasOwnProperty("attr")) {
                property = new verifyData(property);
            }
            property = property.getAttribute();
        }

        //返回结果
        var result = {
            success: true,
            code: 0,
            msg: ""
        }

        //属性是否允许为空
        var isNull = true;
        for (var i = 0; i < property.length; i++) {
            var prop = property[i];
            if (!prop.allowNull) {
                isNull = false;
                break;
            }
        }

        //判断数据是否为空
        if (tools.isEmpty(data) && !isNull) {
            result.success = false;
            result.msg = "Invalid parameter: body is not defined";
            result.code = 1;
        } else if (tools.isEmpty(data) && isNull) {
            /**
             * 验证数据为空并且需验证的字段允许为空
             */
            return result;
        } else {
            for (var i = 0; i < property.length; i++) {
                var prop = property[i];

                //验证属性是否存在
                if (data.hasOwnProperty(prop.name)) {
                    var typeResult;
                    if (tools.isArray(prop.type)) {
                        for (let i = 0; i < prop.type.length; i++) {
                            const type = prop.type[i];
                            //验证属性类型
                            switch (type) {
                                case OBJECT:
                                    typeResult = tools.isObject(data[prop.name]);
                                    break;
                                case ARRAY:
                                    typeResult = tools.isArray(data[prop.name]);
                                    break;
                                case NUMBER:
                                    typeResult = tools.isNumber(data[prop.name]);
                                    break;
                                case BOOLEAN:
                                    typeResult = tools.isBoolean(data[prop.name]);
                                    break;
                                case DATETIME:
                                    typeResult = tools.isDateTime(data[prop.name]);
                                    break;
                                case DATE:
                                    typeResult = tools.isDate(data[prop.name]);
                                    break;
                                case JSONDATA:
                                    typeResult = tools.isJsonData(data[prop.name]);
                                    break;
                                case BASE64:
                                    typeResult = tools.isBase64(data[prop.name]);
                                    break;
                                default:
                                    typeResult = true;
                                    break;
                            }
                            if (typeResult) {
                                break;
                            }
                        }
                    } else {
                        //验证属性类型
                        switch (prop.type) {
                            case OBJECT:
                                typeResult = tools.isObject(data[prop.name]);
                                break;
                            case ARRAY:
                                typeResult = tools.isArray(data[prop.name]);
                                break;
                            case NUMBER:
                                typeResult = tools.isNumber(data[prop.name]);
                                break;
                            case BOOLEAN:
                                typeResult = tools.isBoolean(data[prop.name]);
                                break;
                            case DATETIME:
                                typeResult = tools.isDateTime(data[prop.name]);
                                break;
                            case DATE:
                                typeResult = tools.isDate(data[prop.name]);
                                break;
                            case JSONDATA:
                                typeResult = tools.isJsonData(data[prop.name]);
                                break;
                            case BASE64:
                                typeResult = tools.isBase64(data[prop.name]);
                                break;
                            default:
                                typeResult = true;
                                break;
                        }
                    }
                    //验证数据类型
                    if (!typeResult) {
                        /**
                         * 验证失败
                         */
                        //设置错误信息
                        switch (prop.type) {
                            case OBJECT:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not object!",
                                    param: [prop.name]
                                });
                                break;
                            case ARRAY:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not array!",
                                    param: [prop.name]
                                });
                                break;
                            case NUMBER:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not number!",
                                    param: [prop.name]
                                });
                                break;
                            case BOOLEAN:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not boolean!",
                                    param: [prop.name]
                                });
                                break;
                            case DATETIME:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not datetime!",
                                    param: [prop.name]
                                });
                                break;
                            case DATE:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not date!",
                                    param: [prop.name]
                                });
                                break;
                            case JSONDATA:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not jsondata!",
                                    param: [prop.name]
                                });
                                break;
                            case BASE64:
                                result = error.setError(result, error.INVALID_PARAMETER, {
                                    msg: "{0}: {1} is not base64!",
                                    param: [prop.name]
                                });
                                break;
                        }

                        result.success = false;
                        break;
                    }
                } else {
                    if (prop.allowNull) {
                        continue;
                    } else {
                        result.success = false;
                        result = error.setError(result, error.INVALID_PARAMETER, {
                            msg: "{0}: {1} is not defined!",
                            param: [prop.name]
                        });
                        break;
                    }
                }
            }
        }

        return result;
    }

    /**
     * 验证参数
     * @class
     * @public
     * @example
     * verify = require("./middleware/verify");
     * var verifyData = new verify.verifyData({
     *     string_data: verify.STRING,
     *     number_data: verify.NUMBER,
     *     boolean_data: verify.BOOLEAN,
     *     text_data: {
     *         type: verify.STRING,
     *         allowNull: true
     *     }
     * });
     */
    class verifyData {
        constructor(data) {
            this.attr = []
            if (tools.isNotEmpty(data)) {
                this.setAttribute(data);
            }
        }

        /**
         * 设置属性
         * @function
         * @public
         * @param {object} options 验证数据
         * @example
         * verify = require("./middleware/verify");
         * var verifyData = new verify.verifyData();
         * verifyData.setAttribute({
         *     string_data: verify.STRING,
         *     number_data: verify.NUMBER,
         *     boolean_data: verify.BOOLEAN,
         *     text_data: {
         *         type: verify.STRING,
         *         allowNull: true
         *     }
         * });
         */
        setAttribute(data) {

            for (var p in data) {
                if (typeof data[p] === "string") {
                    this.attr.push({
                        name: p,
                        type: data[p]
                    });
                } else if (typeof data[p] === "object") {
                    var param = {
                        name: p,
                        type: data[p]["type"]
                    }
                    if (data[p].hasOwnProperty("allowNull")) {
                        param.allowNull = data[p]["allowNull"];
                    }
                    this.attr.push(param);
                }
            }
        }

        getAttribute() {
            return this.attr;
        }
    }


    module.exports.verifyData = verifyData;
    module.exports.execute = execute;
    module.exports.isArray = isArray;
    module.exports.OBJECT = OBJECT;
    module.exports.NUMBER = NUMBER;
    module.exports.BOOLEAN = BOOLEAN;
    module.exports.STRING = STRING;
    module.exports.TEXT = TEXT;
    module.exports.JSONDATA = JSONDATA;
    module.exports.DATETIME = DATETIME;
    module.exports.DATE = DATE;
    module.exports.ARRAY = ARRAY;
    module.exports.BASE64 = BASE64;
    module.exports.FUNCTION = FUNCTION;
})();