"use strict";

/**
 * 合同付款
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_payment");

    /**
     * 相关接口
     * 1.获取合同付款列表
     * 2.修改合同付款
     */

    /**
     * 获取合同付款列表
     */
    const list = {
        method: "post",
        routor: "/prj/payment/list",
        describe: "获取合同付款列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改合同付款
     */
    const update = {
        method: "post",
        routor: "/prj/payment/update",
        describe: "修改合同付款",
        msgsend: true,
        ident: "contract",
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.update = update;
    module.exports.description = "合同付款";
})();