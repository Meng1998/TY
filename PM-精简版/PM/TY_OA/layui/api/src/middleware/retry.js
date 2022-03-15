"use strict";

/**
 * 请求结果处理
 */
(function () {

    const tools = require("../utils/tools");
    const error = require("./error");

    /** 
     * findOne回调处理
     * @public
     * @function findOne
     * @param {object} data 查询结果
     * @param {object} callback 回调方法
     * @example
     * const verify = require("./middleware/verify");
     * 
     * retry.findOne(data, callback);
     * @example
     * const verify = require("./middleware/verify");
     * 
     * retry.findOne({
     *     data: data,
     *     error: error.SUCCESS,
     *     callback: callback
     * });
     */
    async function findOne(data, callback, err = error.INVALID_DATA) {
        if (tools.isEmpty(data)) {
            await callback({
                success: false,
                code: err.code,
                msg: err.description
            });
        } else {
            await callback({
                success: true,
                data: data
            });
        }
    }

    /** 
     * findAll回调处理
     * @public
     * @function findAll
     * @param {object} data 查询结果
     * @param {object} callback 回调方法
     * @example
     * const verify = require("./middleware/verify");
     * 
     * retry.findAll(data, callback);
     * @example
     * const verify = require("./middleware/verify");
     * 
     * retry.findAll({
     *     data: data,
     *     error: error.SUCCESS,
     *     callback: callback
     * });
     */
    function findAll(data, callback) {
        var err;
        if (arguments.length === 1 && typeof data === 'object') {
            callback = data.callback;
            data = data.data;
            err = data.error;
        } else {
            err = error.INVALID_DATA;
        }

        callback({
            success: true,
            data: data
        });
    }

    /** 
     * create回调处理
     * @public
     * @function create
     * @param {object} data 查询结果
     * @param {object} callback 回调方法
     * @example
     * const verify = require("./middleware/verify");
     * 
     * retry.create(data, callback);
     * @example
     * const verify = require("./middleware/verify");
     * 
     * retry.create({
     *     data: data,
     *     error: error.SUCCESS,
     *     callback: callback
     * });
     */
    function create(data, callback) {
        var err;
        if (arguments.length === 1 && typeof data === 'object') {
            callback = data.callback;
            data = data.data;
            err = data.error;
        } else {
            err = error.INVALID_DATA;
        }

        if (tools.isEmpty(data)) {
            callback({
                success: false,
                code: err.code,
                msg: err.description
            });
        } else {
            callback({
                success: true,
                data: data
            });
        }
    }

    /**
     * update回调处理
     * @public
     * @function update
     * @param {number} count 影响行数
     * @param {function} successCallback 成功时回调放
     * @param {function} errorCallback 失败时回调方法
     * @example
     * const verify = require("./middleware/verify");
     * retry.update(count, async function () {
     *     //执行成功
     *     TODO
     * }, callback);
     * 
     * @description 执行success中耗时操作需做异步处理
     * @example
     * const verify = require("./middleware/verify");
     * await retry.update(count, async function () {
     *     //执行成功
     *     await TODO
     * }, callback);
     */
    async function update(count, successCallback, errorCallback) {
        var err = error.INVALID_DATA;
        if (count > 0) {
            if (successCallback === errorCallback) {
                successCallback({
                    success: true,
                    data: count
                });
            } else {
                await successCallback();
            }
        } else {
            await errorCallback({
                success: false,
                code: err.code,
                msg: err.description
            });
        }
    }

    /**
     * bulkCreate回调处理
     * @public
     * @function bulkCreate
     * @param {object} data 查询结果
     * @param {object} callback 回调方法
     */
    async function bulkCreate(data, callback) {
        await callback({
            success: true,
            data: data
        });
    }

    /**
     * bulkCreate回调处理
     * @public
     * @function bulkCreate
     * @param {object} count 影响行数
     * @param {object} callback 回调方法
     */
    async function destroy(count, callback) {
        var err = error.INVALID_DATA;
        if (count > 0) {
            await callback({
                success: true,
                data: count
            });
        } else {
            await callback({
                success: false,
                code: err.code,
                msg: err.description
            });
        }
    }

    /**
     * create主表处理
     * @public
     * @function createForFk
     * @param {number|boolean|object} data 数据
     * @param {function} hasFkCallback 外键数据为空时回调放法
     * @param {function} noFkCallback 外键数据不为空时回调方法
     * @example
     * const verify = require("./middleware/verify");
     * retry.destroyHasFk(data, async function () {
     *     //执行成功
     *     TODO
     * }, callback);
     * 
     * @description 执行success中耗时操作需做异步处理
     * @example
     * const verify = require("./middleware/verify");
     * await retry.destroyHasFk(data, async function () {
     *     //执行成功
     *     await TODO
     * }, callback);
     */
    async function createForFk(data, existDataCallback, nullDataCallback) {
        const err = error.FOREIGN_KEY_CONSTRAINT;
        var result;
        const dataType = tools.dataType(data);
        //判断数据类型
        switch (dataType) {
            case "[object Number]":
                if (data > 0) {
                    result = true;
                }
                break;
            case "[object Object]":
                if (tools.isNotEmpty(data)) {
                    result = true;
                }
                break;
            case "[object Boolean]":
                result = data;
                break;
        }

        if (result) {
            await existDataCallback();
        } else {
            nullDataCallback({
                success: false,
                code: err.code,
                msg: err.description
            });
        }
    }

    /**
     * destroy从表处理
     * @public
     * @function destroyHasFk
     * @param {number} count 数据条数
     * @param {function} nullDataCallback 外键数据不为空时回调方法
     * @param {function} existDataCallback 外键数据为空时回调放法
     * @example
     * const verify = require("./middleware/verify");
     * retry.destroyHasFk(count, async function () {
     *     //执行成功
     *     TODO
     * }, callback);
     * 
     * @description 执行success中耗时操作需做异步处理
     * @example
     * const verify = require("./middleware/verify");
     * await retry.destroyHasFk(count, async function () {
     *     //执行成功
     *     await TODO
     * }, callback);
     */
    async function destroyHasFk(count, nullDataCallback, existDataCallback) {
        var err = error.FOREIGN_KEY_CONSTRAINT;
        if (count > 0) {
            await existDataCallback({
                success: false,
                code: err.code,
                msg: err.description
            });
        } else {
            await nullDataCallback();
        }
    }

    /**
     * 文件未找到
     * @param {function} callback 方法回调
     */
    async function fileUndefined(callback) {
        var err = error.FILE_UNDEFINED;
        await callback({
            success: false,
            code: err.code,
            msg: err.description
        });
    }

    /**
     * 
     * @public
     * @function length
     * @param {object} data 查询结果
     * @param {object} callback 回调方法
     */
    async function length(data, callback) {
        await callback({
            success: true,
            data: data.length
        });
    }

    /**
     * 
     * @function result
     * @param {boolean} success 执行结果
     * @param {object} err 错误消息
     */
    async function result(success, err) {
        return {
            success: success,
            code: err.code,
            msg: err.description
        }
    }

    module.exports.result = result;
    module.exports.length = length;
    module.exports.findOne = findOne;
    module.exports.findAll = findAll;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.bulkCreate = bulkCreate;
    module.exports.destroy = destroy;
    module.exports.createForFk = createForFk;
    module.exports.destroyHasFk = destroyHasFk;
    module.exports.fileUndefined = fileUndefined;
})();