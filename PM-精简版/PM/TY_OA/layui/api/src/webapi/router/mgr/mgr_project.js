"use strict";

/**
 * 项目补充
 */
(function () {
    const response = require("../../../middleware/response");
    const controller = require("../../../controllers/mgr/mgr_project");

    /**
     * 相关接口
     * 1.获取项目分布
     * 2.获取项目状态
     * 3.获取项目合同
     */

    /**
     * 获取项目分布
     */
    const distrib = {
        method: "post",
        routor: "/mgr/project/distrib",
        describe: "获取项目分布",
        callback: async function (req, res) {
            await controller.distrib(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取项目状态
     */
    const status = {
        method: "get",
        routor: "/mgr/project/status",
        describe: "获取项目状态",
        callback: async function (res) {
            await controller.status(function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取项目合同
     */
    const contract = {
        method: "post",
        routor: "/mgr/project/contract",
        describe: "获取项目合同",
        callback: async function (req, res) {
            await controller.contract(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.distrib = distrib;
    module.exports.status = status;
    module.exports.contract = contract;
    module.exports.description = "管理信息";
})();