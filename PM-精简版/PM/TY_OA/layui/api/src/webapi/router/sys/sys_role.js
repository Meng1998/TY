"use strict";

/**
 * 平台系统用户
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/sys/sys_role");

    /**
     * 相关接口
     * 1.获取角色信息
     * 2.部门角色
     * 3.添加角色
     * 4.修改角色
     * 5.删除角色
     */

    /**
     * 获取部门信息
     */
    const role = {
        method: "post",
        routor: "/sys/role",
        describe: "获取角色信息",
        callback: async function (req, res) {
            await controller.role(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 部门角色
     */
    const rolesRegion = {
        method: "get",
        routor: "/sys/role/rolesRegion",
        describe: "部门角色", 
        callback: async function (res) {
            await controller.rolesRegion(function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加角色
     */
    const create = {
        method: "post",
        routor: "/sys/role/create",
        describe: "添加角色",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改角色
     */
    const update = {
        method: "post",
        routor: "/sys/role/update",
        describe: "修改角色",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除角色
     */
    const destroy = {
        method: "post",
        routor: "/sys/role/delete",
        describe: "删除角色",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.role = role;
    module.exports.rolesRegion = rolesRegion;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "系统角色";
})();