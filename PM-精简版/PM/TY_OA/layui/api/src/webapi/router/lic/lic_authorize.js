"use strict";

/**
 * 许可授权
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/lic/lic_authorize");

    /**
     * 相关接口
     * 1.获取许可授权列表
     * 2.添加许可授权
     * 3.删除许可授权
     * 4.上传授权文件
     * 5.获取授权文件下载路径
     */

    /**
     * 获取许可授权列表
     */
    const list = {
        method: "post",
        routor: "/lic/authorize/list",
        describe: "获取许可授权列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加许可授权
     */
    const create = {
        method: "post",
        routor: "/lic/authorize/create",
        describe: "添加许可授权",
        writelog: true,
        msgsend: true,
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除许可授权
     */
    const destroy = {
        method: "post",
        routor: "/lic/authorize/delete",
        describe: "删除许可授权",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 上传授权文件
     */
    const upload = {
        method: "post",
        routor: "/lic/authorize/upload",
        describe: "上传授权文件",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.upload(req.body, req.files, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取授权文件下载路径
     */
    const download = {
        method: "post",
        routor: "/lic/authorize/download",
        describe: "获取授权文件下载路径",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.download(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.destroy = destroy;
    module.exports.upload = upload;
    module.exports.download = download;
    module.exports.description = "项目授权";
})();