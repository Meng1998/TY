"use strict";

/**
 * 消息通知人员配置
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_notice_user");

    /**
     * 相关接口
     * 1.获取消息通知人员配置列表
     * 2.添加消息通知人员配置
     * 3.删除消息通知人员配置
     */

    /**
     * 获取消息通知人员配置列表
     */
    const list = {
        method: "post",
        routor: "/work/notice_user/list",
        describe: "获取消息通知人员配置列表",
        writelog: true,
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加消息通知人员配置
     */
    const create = {
        method: "post",
        routor: "/work/notice_user/create",
        describe: "添加消息通知人员配置",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除消息通知人员配置
     */
    const destroy = {
        method: "post",
        routor: "/work/notice_user/delete",
        describe: "删除消息通知人员配置",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.destroy = destroy;
    module.exports.description = "消息通知人员配置";
})();