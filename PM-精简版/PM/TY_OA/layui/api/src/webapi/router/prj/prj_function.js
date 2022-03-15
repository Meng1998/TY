"use strict";

/**
 * 功能需求
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_function");

    /**
     * 相关接口
     * 1.获取功能需求
     * 2.添加功能需求
     * 4.删除功能需求
     */

    /**
     * 获取功能需求
     */
    const list = {
        method: "post",
        routor: "/prj/function/list",
        describe: "获取功能需求",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加功能需求
     */
    const create = {
        method: "post",
        routor: "/prj/function/create",
        describe: "添加功能需求",
        writelog: true,
        msgsend: true,
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改功能需求
     */
    const update = {
        method: "post",
        routor: "/prj/function/update",
        describe: "修改功能需求",
        msgsend: true,
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除功能需求
     */
    const destroy = {
        method: "post",
        routor: "/prj/function/delete",
        describe: "删除功能需求",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "功能需求";
})();