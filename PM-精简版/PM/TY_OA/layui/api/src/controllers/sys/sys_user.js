"use strict";

/**
 * 系统用户
 */
(function () {

    const model = require("../../model/main")("sys_user", "sys_department");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");
    const captcha = require("../../webapi/router/captcha");

    /**
     * 获取用户信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const user = async function (options, callback) {
        await action.findByPk(options, "sys_user", callback);
    }

    /**
     * 用户验证
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const login = async function login(options, callback) {

        //验证请求数据
        var result = verify.execute(options, {
            user_name: verify.STRING,
            user_pwd: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        if (options.captcha_code && options.captcha_ident) {
            var result = captcha.captchaCache.verify(options.captcha_code, options.captcha_ident);
            if (!result) {
                callback({
                    success: false,
                    code: 501,
                    msg: "captcha error!"
                });
                return;
            }
        }
        //options.user_pwd = tools.md5(options.user_pwd);//密码加密
        options.job_status = "1";//在职状态
        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options, ["user_name", "user_pwd", "job_status"]);
        //condition.setAttributes(["id", "full_name", "dept_id", "dept_name", "role_id", "role_name"]);

        const sys_user = await model.sys_user();
        const data = await sys_user.findOne(condition.getOptions());
        retry.findOne(data, callback);
    }

    /**
     * 通讯录
     * @param {function} callback 回调方法
     */
    const addressBook = async function (callback) {
        //查询部门
        const sys_department = await model.sys_department();
        var departments = await sys_department.findAll();
        for (let i = 0; i < departments.length; i++) {
            const dept = departments[i];
            dept.node_type = "dept";
            dept.text = dept.dept_name;
            delete dept.dept_name;

            dept.pid = dept.dept_parent;
            delete dept.dept_parent;
        }

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere([{
            job_status: "1"
        }]);
        condition.setAttributes(["id", "full_name", "dept_id", "dept_name", "role_name", "user_tel", "user_email", "user_qq", "user_wechat"]);

        //查询人员
        const sys_user = await model.sys_user();
        var users = await sys_user.findAll(condition.getOptions());
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            user.node_type = "user";
            user.text = user.full_name;
            delete user.full_name;

            user.pid = user.dept_id;
            delete user.dept_id;
        }

        //合并数据
        var data = departments.concat(users);
        var addressBook = tools.tree(data, true, "dept");

        retry.findAll(addressBook, callback);
    }

    /**
     * 添加用户
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            user_name: verify.STRING,
            full_name: verify.STRING,
            dept_id: verify.STRING,
            dept_name: verify.STRING,
            role_id: verify.STRING,
            role_name: verify.STRING,
            user_tel: verify.STRING,
            entry_time: verify.DATE,
            wages: verify.NUMBER
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const sys_user = await model.sys_user();
        const data = await sys_user.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改人员
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            user_name: {
                type: verify.STRING,
                allowNull: true
            },
            full_name: {
                type: verify.STRING,
                allowNull: true
            },
            dept_id: {
                type: verify.STRING,
                allowNull: true
            },
            dept_name: {
                type: verify.STRING,
                allowNull: true
            },
            role_id: {
                type: verify.STRING,
                allowNull: true
            },
            role_name: {
                type: verify.STRING,
                allowNull: true
            },
            entry_time: {
                type: verify.DATE,
                allowNull: true
            },
            user_tel: {
                type: verify.STRING,
                allowNull: true
            },
            contract_sign: {
                type: verify.DATE,
                allowNull: true
            },
            contract_expire: {
                type: verify.DATE,
                allowNull: true
            },
            emergency_contacts: {
                type: verify.STRING,
                allowNull: true
            },
            emergency_tel: {
                type: verify.STRING,
                allowNull: true
            },
            bank: {
                type: verify.STRING,
                allowNull: true
            },
            bankcard: {
                type: verify.STRING,
                allowNull: true
            },
            wages: {
                type: verify.NUMBER,
                allowNull: true
            },
            user_email: {
                type: verify.STRING,
                allowNull: true
            },
            user_qq: {
                type: verify.STRING,
                allowNull: true
            },
            user_wechat: {
                type: verify.STRING,
                allowNull: true
            },
            identity_card: {
                type: verify.STRING,
                allowNull: true
            },
            birthday: {
                type: verify.STRING,
                allowNull: true
            },
            university: {
                type: verify.STRING,
                allowNull: true
            },
            speciality: {
                type: verify.STRING,
                allowNull: true
            },
            education: {
                type: verify.STRING,
                allowNull: true
            },
            native_place: {
                type: verify.STRING,
                allowNull: true
            }
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_user = await model.sys_user();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await sys_user.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await sys_user.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 获取用户列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            full_name: {
                type: verify.STRING,
                allowNull: true
            },
            dept_id: {
                type: verify.STRING,
                allowNull: true
            }
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_user = await model.sys_user();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            entry_time: "ASC"
        });

        var params = condition.options;
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.full_name)) {
            params.where.full_name = {
                [Sequelize.Op.like]: "%" + options.full_name + "%"
            }
        }
        //是否显示超级管理员
        if (!options.superadmin || !JSON.parse(options.superadmin)) {
            //移除系统管理员
            params.where.user_name = {
                [Sequelize.Op.ne]: "superadmin"
            }
        }

        //删除属性
        delete options.superadmin

        var data = {};
        data.list = await sys_user.findAll(condition.getOptions());
        data.count = await sys_user.count(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 删除人员
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        //定义模型
        const sys_user = await model.sys_user();
        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        //修改数据
        const count = await sys_user.update({
            job_status: "0"
        }, condition.getOptions());

        await retry.update(count, async function () {
            const data = await sys_user.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
        //await action.destroyByPk(options, "sys_user", callback);
    }

    /**
     * 修改密码
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const changePwd = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            user_pwd: verify.STRING,
            new_pwd: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_user = await model.sys_user();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options, ["id", "user_pwd"]);

        //修改数据
        const user = await sys_user.findOne(condition.getOptions());
        await retry.findOne(user, async function (result) {
            if (!result.success) {
                callback(result);
                return;
            }
            //修改密码
            var condition = new Sequelize.Options();
            condition.setWhere(options, ["id", "user_pwd"]);

            //修改数据
            const count = await sys_user.update({
                user_pwd: options.new_pwd
            }, condition.getOptions());

            await retry.update(count, async function () {
                const data = await sys_user.findByPk(options.id);
                retry.findOne(data, callback);
            }, callback);
        }, callback);
    }

    /**
     * 重置密码
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const resetPwd = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_user = await model.sys_user();

        //修改密码
        var condition = new Sequelize.Options();
        condition.setWhere(options, ["id"]);

        //修改数据
        var count = await sys_user.update({
            user_pwd: "123456"
        }, condition.getOptions());

        const user = await sys_user.findByPk(options.id);
        if (user.user_pwd === "123456") {
            count = 1;
        }

        await retry.update(count, async function () {
            const data = await sys_user.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
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
})();