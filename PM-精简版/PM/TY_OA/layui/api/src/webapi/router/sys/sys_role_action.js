"use strict";

/**
 * 系统功能
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/sys/sys_role_action");

    /**
     * 相关接口
     * 1.根据角色获取所有功能列表
     * 2.配置角色功能
     * 3.获取功能所分配的角色
     * 4.编辑功能权限
     */

    /**
     * 根据角色获取所有功能列表
     */
    const actionAuthRole = {
        method: "post",
        routor: "/sys/role_action/actionAuthRole",
        describe: "根据角色获取所有功能列表",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.actionAuthRole(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 配置角色功能
     */
    const actionChange = {
        method: "post",
        routor: "/sys/role_action/actionChange",
        describe: "配置角色功能",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.actionChange(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取功能所分配的角色
     */
    const roleForAction = {
        method: "post",
        routor: "/sys/role_action/roleForAction",
        describe: "获取功能所分配的角色",
        callback: async function (req, res) {
            await controller.roleForAction(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 编辑功能权限
     */
    const editRoleAction = {
        method: "post",
        routor: "/sys/role_action/editRoleAction",
        describe: "编辑功能权限",
        callback: async function (req, res) {
            await controller.editRoleAction(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.actionAuthRole = actionAuthRole;
    module.exports.actionChange = actionChange;
    module.exports.roleForAction = roleForAction;
    module.exports.editRoleAction = editRoleAction;
    module.exports.description = "角色功能";
})();