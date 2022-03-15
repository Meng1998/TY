"use strict";

/**
 * 系统功能
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/sys/sys_action");

    /**
     * 相关接口
     * 1.根据角色获取功能列表
     * 2.获取功能信息
     * 3.添加功能
     * 4.获取功能列表
     * 5.修改功能
     * 6.删除功能
     */

    /**
     * 根据角色获取功能列表
     */
    const actionByRole = {
        method: "post",
        routor: "/sys/action/actionByRole",
        describe: "根据角色获取功能列表",
        callback: async function (req, res) {
            await controller.actionByRole(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取功能信息
     */
    const action = {
        method: "post",
        routor: "/sys/action",
        describe: "获取功能信息",
        callback: async function (req, res) {
            await controller.action(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加功能
     */
    const create = {
        method: "post",
        routor: "/sys/action/create",
        describe: "添加功能",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取功能列表
     */
    const list = {
        method: "get",
        routor: "/sys/action/list",
        describe: "获取功能列表",
        callback: async function (res) {
            await controller.list(function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改功能
     */
    const update = {
        method: "post",
        routor: "/sys/action/update",
        describe: "修改功能",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除功能
     */
    const destroy = {
        method: "post",
        routor: "/sys/action/delete",
        describe: "删除功能",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.actionByRole = actionByRole;
    module.exports.action = action;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "系统功能";
})();