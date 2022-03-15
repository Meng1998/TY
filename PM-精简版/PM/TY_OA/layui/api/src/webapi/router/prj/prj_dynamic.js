"use strict";

/**
 * 项目动态
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_dynamic");

    /**
     * 相关接口
     * 1.获取项目动态
     * 2.添加项目动态
     * 3.修改项目动态
     * 4.删除项目动态
     */

    /**
     * 获取项目动态
     */
    const list = {
        method: "post",
        routor: "/prj/dynamic/list",
        describe: "获取项目动态",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加项目动态
     */
    const create = {
        method: "post",
        routor: "/prj/dynamic/create",
        describe: "添加项目动态",
        msgsend: true,
        ident: "dynamic",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改项目动态
     */
    const update = {
        method: "post",
        routor: "/prj/dynamic/update",
        describe: "修改项目动态",
        msgsend: true,
        ident: "dynamic",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除项目动态
     */
    const destroy = {
        method: "post",
        routor: "/prj/dynamic/delete",
        describe: "删除项目动态",
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
    module.exports.description = "项目动态";
})();