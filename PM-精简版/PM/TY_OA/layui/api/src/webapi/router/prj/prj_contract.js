"use strict";

/**
 * 合同信息
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_contract");

    /**
     * 相关接口
     * 1.获取合同列表
     * 2.添加合同
     */

    /**
     * 获取合同列表
     */
    const list = {
        method: "post",
        routor: "/prj/contract/list",
        describe: "获取合同列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加合同
     */
    const create = {
        method: "post",
        routor: "/prj/contract/create",
        describe: "添加合同",
        writelog: true,
        msgsend: true,
        ident: "contract",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, req.files, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.description = "合同信息";
})();