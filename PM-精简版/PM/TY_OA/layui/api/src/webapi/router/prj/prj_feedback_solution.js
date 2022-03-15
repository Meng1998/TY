"use strict";

/**
 * 项目反馈方案
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_feedback_solution");

    /**
     * 相关接口
     * 1.获取项目反馈方案
     * 2.修改反馈方案
     */

    /**
     * 获取项目反馈方案
     */
    const list = {
        method: "post",
        routor: "/prj/feedback_solution/list",
        describe: "获取项目反馈方案",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改反馈方案
     */
    const update = {
        method: "post",
        routor: "/prj/feedback_solution/update",
        describe: "修改反馈方案",
        msgsend: true,
        ident: "notice.feedback",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.update = update;
    module.exports.description = "项目反馈方案";
})();