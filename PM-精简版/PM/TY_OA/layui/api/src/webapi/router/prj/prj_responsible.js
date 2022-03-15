"use strict";

/**
 * 客户信息
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_responsible");

    /**
     * 相关接口
     * 1.获取项目负责人列表
     * 2.添加项目负责人
     * 3.删除项目负责人
     */

    /**
     * 获取项目负责人列表
     */
    const list = {
        method: "post",
        routor: "/prj/responsible/list",
        describe: "获取项目负责人列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加项目负责人
     */
    const create = {
        method: "post",
        routor: "/prj/responsible/create",
        describe: "添加项目负责人",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除项目负责人
     */
    const destroy = {
        method: "post",
        routor: "/prj/responsible/delete",
        describe: "删除项目负责人",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.destroy = destroy;
    module.exports.description = "项目负责人";
})();