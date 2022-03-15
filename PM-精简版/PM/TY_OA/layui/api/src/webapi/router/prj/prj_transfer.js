"use strict";

/**
 * 项目移交
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_transfer");

    /**
     * 相关接口
     * 1.获取项目移交
     * 2.添加项目移交
     */


    /**
     * 获取项目移交
     */
    const list = {
        method: "post",
        routor: "/prj/transfer/list",
        describe: "获取项目移交",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加项目移交
     */
    const create = {
        method: "post",
        routor: "/prj/transfer/create",
        describe: "添加项目移交",
        msgsend: true,
        ident: "project",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.description = "项目负责人";
})();