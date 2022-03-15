"use strict";

/**
 * 行政区划
 */
(function () {
    const response = require("../../../middleware/response");
    const controller = require("../../../controllers/sys/sys_region");

    /**
     * 相关接口
     * 1.获取行政区划
     */

    /**
     * 获取行政区划
     */
    const list = {
        method: "post",
        routor: "/sys/region/list",
        describe: "获取行政区划", 
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.description = "行政区划";
})();