"use strict";

/**
 * 消息通知类别
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_notice_category");

    /**
     * 相关接口
     * 1.获取消息通知类别信息
     * 2.添加消息通知类别
     * 3.获取消息通知类别列表
     * 4.修改消息通知类别
     * 5.修改消息通知类别
     */

    /**
     * 获取消息通知类别信息
     */
    const notice_category = {
        method: "post",
        routor: "/work/notice_category",
        describe: "获取消息通知类别信息",
        callback: async function (req, res) {
            await controller.notice_category(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加消息通知类别
     */
    const create = {
        method: "post",
        routor: "/work/notice_category/create",
        describe: "添加消息通知类别",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取消息通知类别列表
     */
    const list = {
        method: "post",
        routor: "/work/notice_category/list",
        describe: "获取消息通知类别列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改消息通知类别
     */
    const update = {
        method: "post",
        routor: "/work/notice_category/update",
        describe: "修改消息通知类别",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改消息通知类别
     */
    const destroy = {
        method: "post",
        routor: "/work/notice_category/delete",
        describe: "修改消息通知类别",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.notice_category = notice_category;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "消息通知类别";
})();