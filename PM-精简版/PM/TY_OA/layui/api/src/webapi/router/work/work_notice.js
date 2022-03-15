"use strict";

/**
 * 消息通知
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_notice");

    /**
     * 相关接口
     * 1.获取消息通知
     * 2.获取消息通知列表
     * 3.添加消息通知
     * 4.批量添加消息通知
     * 5.修改消息通知
     */

    /**
     * 获取项目信息
     */
    const notice = {
        method: "post",
        routor: "/work/notice",
        describe: "获取消息通知",
        callback: async function (req, res) {
            await controller.notice(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取消息通知列表
     */
    const list = {
        method: "post",
        routor: "/work/notice/list",
        describe: "获取消息通知列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加消息通知
     */
    const create = {
        method: "post",
        routor: "/work/notice/create",
        describe: "添加消息通知",
        msgsend: true,
        ident: "notice",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改消息通知
     */
    const update = {
        method: "post",
        routor: "/work/notice/update",
        describe: "修改消息通知",
        msgsend: true,
        ident: "notice",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.notice = notice;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.description = "项目补充";
})();