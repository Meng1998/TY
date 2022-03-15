"use strict";

/**
 * 平台系统用户
 */
(function () {
    const response = require("../../../middleware/response");
    const enumerate = require("../../../middleware/enumerate");
    const controller = require("../../../controllers/sys/sys_user");

    /**
     * 相关接口
     * 1.获取用户信息
     * 2.平台用户验证
     * 3.添加用户
     * 4.获取用户列表
     * 5.通讯录
     * 6.修改人员
     * 7.删除人员
     * 8.修改密码
     * 9.重置密码
     */

    /**
     * 获取用户信息
     */
    const user = {
        method: "post",
        routor: "/sys/user",
        describe: "获取用户信息",
        callback: async function (req, res) {
            await controller.user(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 平台用户验证
     */
    const login = {
        method: "post",
        routor: "/sys/user/login",
        describe: "平台用户验证",
        writelog: true,
        msgsend: true,
        ident: "login",
        callback: async function (req, res) {
            await controller.login(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 添加用户
     */
    const create = {
        method: "post",
        routor: "/sys/user/create",
        describe: "添加用户",
        writelog: true,
        operation: enumerate.Operation.Create,
        callback: async function (req, res) {
            await controller.create(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 获取用户列表
     */
    const list = {
        method: "post",
        routor: "/sys/user/list",
        describe: "获取用户列表",
        callback: async function (req, res) {
            await controller.list(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 通讯录
     */
    const addressBook = {
        method: "get",
        routor: "/sys/user/addressBook",
        describe: "通讯录",
        callback: async function (res) {
            await controller.addressBook(function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改人员
     */
    const update = {
        method: "post",
        routor: "/sys/user/update",
        describe: "修改人员",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.update(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 删除人员
     */
    const destroy = {
        method: "post",
        routor: "/sys/user/delete",
        describe: "删除人员",
        operation: enumerate.Operation.Delete,
        callback: async function (req, res) {
            await controller.destroy(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 修改密码
     */
    const changePwd = {
        method: "post",
        routor: "/sys/user/changePwd",
        describe: "修改密码",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.changePwd(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    /**
     * 重置密码
     */
    const resetPwd = {
        method: "post",
        routor: "/sys/user/resetPwd",
        describe: "重置密码",
        operation: enumerate.Operation.Update,
        callback: async function (req, res) {
            await controller.resetPwd(req.body, function (result) {
                res.send(response.jsonData(result));
            });
        }
    }

    module.exports.user = user;
    module.exports.login = login;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.addressBook = addressBook;
    module.exports.update = update;
    module.exports.destroy = destroy;
    module.exports.changePwd = changePwd;
    module.exports.resetPwd = resetPwd;
    module.exports.description = "系统用户";
})();