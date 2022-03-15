"use strict";

/**
 * 差旅管理
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_bustrip");

    /**
     * 相关接口
     * 1.添加差旅
     * 2.获取差旅列表
     * 3.修改差旅状态
     * 4.删除出差
     * 5.修改差旅
     */

    /**
     * 添加差旅
     */
    const create = {
        method: "post",
        routor: "/work/bustrip/create",
        describe: "添加差旅",
        msgsend: true,
        ident: "bustrip",
        writelog: true,
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取差旅列表
     */
    const list = {
        method: "post",
        routor: "/work/bustrip/list",
        describe: "获取差旅列表",
        writelog: true,
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改差旅状态
     */
    const end = {
        method: "post",
        routor: "/work/bustrip/end",
        describe: "修改差旅状态",
        msgsend: true,
        ident: "bustrip",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.end(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除出差
     */
    const destroy = {
        method: "post",
        routor: "/work/bustrip/delete",
        describe: "删除出差",
        msgsend: true,
        ident: "bustrip",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改差旅
     */
    const update = {
        method: "post",
        routor: "/work/bustrip/update",
        describe: "修改差旅",
        writelog: true,
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.end = end;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "差旅管理";
})();