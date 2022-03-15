"use strict";

/**
 * 消息通知类型
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_notice_config");

    /**
     * 相关接口
     * 1.获取消息通知类型信息
     * 2.获取消息通知类型列表
     * 3.添加消息通知类型
     * 4.删除消息通知类型
     * 5.修改消息通知类型
     */

    /**
     * 获取消息通知类型信息
     */
    const notice_config = {
        method: "post",
        routor: "/work/notice_config",
        describe: "获取消息通知类型信息",
        callback: async function (req, res) {
            await controller.notice_config(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取消息通知类型列表
     */
    const list = {
        method: "post",
        routor: "/work/notice_config/list",
        describe: "获取消息通知类型列表",
        writelog: true,
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加消息通知类型
     */
    const create = {
        method: "post",
        routor: "/work/notice_config/create",
        describe: "添加消息通知类型",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改消息通知类型
     */
    const update = {
        method: "post",
        routor: "/work/notice_config/update",
        describe: "修改消息通知类型",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除消息通知类型
     */
    const destroy = {
        method: "post",
        routor: "/work/notice_config/delete",
        describe: "删除消息通知类型",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.notice_config = notice_config;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "消息通知类型";
})();