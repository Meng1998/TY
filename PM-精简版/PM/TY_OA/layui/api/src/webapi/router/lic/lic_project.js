"use strict";

/**
 * 授权项目
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/lic/lic_project");

    /**
     * 相关接口
     * 1.获取授权项目列表
     */

    /**
     * 获取授权项目列表
     */
    const list = {
        method: "post",
        routor: "/lic/project/list",
        describe: "获取授权项目列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    } 

    module.exports.list = list; 
    module.exports.description = "授权项目";
})();