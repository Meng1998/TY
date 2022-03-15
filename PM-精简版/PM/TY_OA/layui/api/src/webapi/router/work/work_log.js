"use strict";

/**
 * 工作日志
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_log");

    /**
     * 相关接口
     * 1.获取日志
     * 2.添加日志
     * 3.获取请假列表
     * 4.修改日志
     */

    /**
     * 获取日志
     */
    const log = {
        method: "post",
        routor: "/work/log",
        describe: "获取日志",
        callback: async function (req, res) {
            await controller.log(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加日志
     */
    const create = {
        method: "post",
        routor: "/work/log/create",
        describe: "添加日志",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取日志列表
     */
    const list = {
        method: "post",
        routor: "/work/log/list",
        describe: "获取日志列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改日志
     */
    const update = {
        method: "post",
        routor: "/work/log/update",
        describe: "修改日志",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.log = log;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.description = "工作日志";
})();