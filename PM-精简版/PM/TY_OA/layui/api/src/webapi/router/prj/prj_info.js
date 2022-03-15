"use strict";

/**
 * 项目信息
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_info");

    /**
     * 相关接口
     * 1.获取项目信息
     * 2.获取项目列表
     * 3.添加项目
     * 4.修改项目
     */

    /**
     * 获取项目信息
     */
    const info = {
        method: "post",
        routor: "/prj/info",
        describe: "获取用户信息",
        callback: async function (req, res) {
            await controller.info(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取项目列表
     */
    const list = {
        method: "post",
        routor: "/prj/info/list",
        describe: "获取项目列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加项目
     */
    const create = {
        method: "post",
        routor: "/prj/info/create",
        describe: "添加项目",
        writelog: true,
        msgsend: true,
        ident: "project",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改项目
     */
    const update = {
        method: "post",
        routor: "/prj/info/update",
        describe: "修改项目",
        msgsend: true,
        ident: "project",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.info = info;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.description = "项目信息";
})();