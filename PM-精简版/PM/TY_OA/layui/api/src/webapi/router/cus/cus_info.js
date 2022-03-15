"use strict";

/**
 * 客户信息
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/cus/cus_info");

    /**
     * 相关接口
     * 1.获取客户信息
     * 2.获取客户列表
     * 3.添加客户
     * 4.修改客户
     * 5.删除客户
     */

    /**
     * 获取客户信息
     */
    const info = {
        method: "post",
        routor: "/cus/info",
        describe: "获取客户信息",
        callback: async function (req, res) {
            await controller.info(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取客户列表
     */
    const list = {
        method: "post",
        routor: "/cus/info/list",
        describe: "获取客户列表", 
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加客户
     */
    const create = {
        method: "post",
        routor: "/cus/info/create",
        describe: "添加客户",
        writelog: true,
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改客户
     */
    const update = {
        method: "post",
        routor: "/cus/info/update",
        describe: "修改客户",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除客户
     */
    const destroy = {
        method: "post",
        routor: "/cus/info/delete",
        describe: "删除客户",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.info = info;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "客户信息";
})();