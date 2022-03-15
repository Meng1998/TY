"use strict";

/**
 * 客户联系人
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/cus/cus_contacts");

    /**
     * 相关接口
     * 1.获取客户联系人
     * 2.获取客户联系人列表
     * 3.添加客户联系人
     * 4.修改客户联系人
     * 5.删除客户联系人
     */

    /**
     * 获取客户信息
     */
    const contacts = {
        method: "post",
        routor: "/cus/contacts",
        describe: "获取客户信息",
        callback: async function (req, res) {
            await controller.contacts(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取客户联系人列表
     */
    const list = {
        method: "post",
        routor: "/cus/contacts/list",
        describe: "获取客户联系人列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加客户联系人
     */
    const create = {
        method: "post",
        routor: "/cus/contacts/create",
        describe: "添加客户联系人",
        writelog: true,
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改客户联系人
     */
    const update = {
        method: "post",
        routor: "/cus/contacts/update",
        describe: "修改客户联系人",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除客户联系人
     */
    const destroy = {
        method: "post",
        routor: "/cus/contacts/delete",
        describe: "删除客户联系人",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.contacts = contacts;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.description = "客户联系人";
})();