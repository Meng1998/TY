"use strict";

/**
 * 系统部门
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/sys/sys_department");

    /**
     * 相关接口
     * 1.获取部门信息
     * 2.添加部门
     * 3.获取部门列表
     * 4.修改部门
     * 5.删除部门
     */

    /**
     * 获取部门信息
     */
    const department = {
        method: "post",
        routor: "/sys/department",
        describe: "获取部门信息",
        callback: async function (req, res) {
            await controller.department(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加部门
     */
    const create = {
        method: "post",
        routor: "/sys/department/create",
        describe: "添加部门",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取部门列表
     */
    const list = {
        method: "get",
        routor: "/sys/department/list",
        describe: "获取部门列表",
        callback: async function (res) {
            await controller.list(function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改部门
     */
    const update = {
        method: "post",
        routor: "/sys/department/update",
        describe: "修改部门",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除部门
     */
    const destroy = {
        method: "post",
        routor: "/sys/department/delete",
        describe: "删除部门",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.department = department;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "系统部门";
})();