"use strict";

/**
 * 项目补充
 */
(function () {
    const response = require("../../../middleware/response");
    const controller = require("../../../controllers/mgr/mgr_personnel");

    /**
     * 相关接口
     * 1.人员状态统计
     */

    /**
     * 人员状态统计
     */
    const status = {
        method: "get",
        routor: "/mgr/personnel/status",
        describe: "人员状态统计",
        callback: async function (res) {
            await controller.status(function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.status = status;
    module.exports.description = "人员信息";
})();