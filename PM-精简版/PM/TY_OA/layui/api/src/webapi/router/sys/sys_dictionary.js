"use strict";

/**
 * 平台系统字典
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/sys/sys_dictionary");

    /**
     * 相关接口
     * 1.获取字典信息
     * 2.添加字典
     * 3.获取字典列表
     * 4.修改字典
     * 5.删除字典
     */

    /**
     * 获取字典信息
     */
    const dictionary = {
        method: "post",
        routor: "/sys/dictionary",
        describe: "获取字典信息",
        callback: async function (req, res) {
            await controller.dictionary(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加字典
     */
    const create = {
        method: "post",
        routor: "/sys/dictionary/create",
        describe: "添加字典",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取字典列表
     */
    const list = {
        method: "post",
        routor: "/sys/dictionary/list",
        describe: "获取字典列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改字典
     */
    const update = {
        method: "post",
        routor: "/sys/dictionary/update",
        describe: "修改字典",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除字典
     */
    const destroy = {
        method: "post",
        routor: "/sys/dictionary/delete",
        describe: "删除字典",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.dictionary = dictionary;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "系统字典";
})();