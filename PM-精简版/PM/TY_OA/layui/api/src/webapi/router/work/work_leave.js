"use strict";

/**
 * 请假管理
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/work/work_leave");

    /**
     * 相关接口
     * 1.添加请假
     * 2.获取请假列表
     * 3.请假审批
     * 4.删除请假
     */

    /**
     * 添加请假
     */
    const create = {
        method: "post",
        routor: "/work/leave/create",
        describe: "添加请假",
        writelog: true,
        msgsend: true,
        ident: "leave",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取请假列表
     */
    const list = {
        method: "post",
        routor: "/work/leave/list",
        describe: "获取请假列表",
        writelog: true,
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 请假审批
     */
    const approval = {
        method: "post",
        routor: "/work/leave/approval",
        describe: "请假审批",
        writelog: true,
        msgsend: true,
        ident: "leave",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.approval(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除请假
     */
    const destroy = {
        method: "post",
        routor: "/work/leave/delete",
        describe: "删除请假",
        msgsend: true,
        ident: "leave",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.approval = approval;
    module.exports.destroy = destroy;
    module.exports.description = "请假管理";
})();