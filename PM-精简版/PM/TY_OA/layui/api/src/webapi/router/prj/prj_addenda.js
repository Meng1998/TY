"use strict";

/**
 * 项目补充
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_addenda");

    /**
     * 相关接口
     * 1.获取项目补充列表
     * 2.添加项目补充
     * 3.修改项目补充
     * 4.删除项目补充
     */

    /**
     * 获取项目补充列表
     */
    const list = {
        method: "post",
        routor: "/prj/addenda/list",
        describe: "获取项目补充列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加项目补充
     */
    const create = {
        method: "post",
        routor: "/prj/addenda/create",
        describe: "添加项目补充",
        writelog: true,
        msgsend: true,
        ident: "addenda",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改项目补充
     */
    const update = {
        method: "post",
        routor: "/prj/addenda/update",
        describe: "修改项目补充",
        msgsend: true,
        ident: "addenda",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除项目补充
     */
    const destroy = {
        method: "post",
        routor: "/prj/addenda/delete",
        describe: "删除项目补充",
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
    module.exports.description = "项目补充";
})();