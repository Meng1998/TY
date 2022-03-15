"use strict";

/**
 * 项目反馈
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_feedback");

    /**
     * 相关接口
     * 1.获取项目反馈信息
     * 2.获取项目反馈列表
     * 3.添加项目反馈
     * 4.修改项目反馈
     * 5.获取项目反馈列表
     * 6.删除项目反馈
     */

    /**
     * 获取项目反馈信息
     */
    const feedback = {
        method: "post",
        routor: "/prj/feedback",
        describe: "获取项目反馈信息",
        callback: async function (req, res) {
            await controller.feedback(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取项目反馈列表
     */
    const list = {
        method: "post",
        routor: "/prj/feedback/list",
        describe: "获取项目反馈列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加项目反馈
     */
    const create = {
        method: "post",
        routor: "/prj/feedback/create",
        describe: "添加项目反馈",
        writelog: true,
        msgsend: true,
        ident: "feedback",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改项目反馈
     */
    const update = {
        method: "post",
        routor: "/prj/feedback/update",
        describe: "修改项目反馈",
        writelog: true,
        msgsend: true,
        ident: "feedback",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取项目反馈列表
     */
    const feedbackByProject = {
        method: "post",
        routor: "/prj/feedback/feedbackByProject",
        describe: "获取项目反馈列表",
        callback: async function (req, res) {
            await controller.feedbackByProject(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除项目反馈
     */
    const destroy = {
        method: "post",
        routor: "/prj/feedback/delete",
        describe: "删除项目反馈",
        msgsend: true,
        ident: "feedback",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.feedback = feedback;
    module.exports.list = list;
    module.exports.feedbackByProject = feedbackByProject;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "项目反馈";
})();