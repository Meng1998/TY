"use strict";

/**
 * 合同附件
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/prj/prj_files");

    /**
     * 相关接口
     * 1.获取合同附件列表
     */

    /**
     * 获取合同付款列表
     */
    const list = {
        method: "post",
        routor: "/prj/files/list",
        describe: "获取合同付款列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.description = "合同附件";
})();