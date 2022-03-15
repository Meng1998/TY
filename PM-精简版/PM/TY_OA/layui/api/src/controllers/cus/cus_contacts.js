"use strict";

/**
 * 客户联系人
 */
(function () {

    const model = require("../../model/main")("cus_contacts");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取客户联系人
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const contacts = async function (options, callback) {
        await action.findByPk(options, "cus_contacts", callback);
    }

    /**
     * 获取联系人列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            custom_id: {
                type: verify.STRING,
                allowNull: true
            },
            custom_name: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_name: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_role: {
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
        const cus_contacts = await model.cus_contacts();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        var params = condition.options;

        //设置模糊查询：客户名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.custom_name)) {
            params.where.custom_name = {
                [Sequelize.Op.like]: "%" + options.custom_name + "%"
            }
        }
        //设置模糊查询：联系人名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.contacts_name)) {
            params.where.contacts_name = {
                [Sequelize.Op.like]: "%" + options.contacts_name + "%"
            }
        }
        //设置模糊查询：联系人角色
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.contacts_role)) {
            params.where.contacts_role = {
                [Sequelize.Op.like]: "%" + options.contacts_role + "%"
            }
        }

        var data = {};
        data.list = await cus_contacts.findAll(condition.getOptions());
        data.count = await cus_contacts.count(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 添加联系人
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            custom_id: verify.STRING,
            custom_name: verify.STRING,
            contacts_name: verify.STRING,
            contacts_tel: verify.STRING,
            contacts_role: verify.STRING,
            remark: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const cus_contacts = await model.cus_contacts();
        const data = await cus_contacts.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改联系人
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            custom_id: {
                type: verify.STRING,
                allowNull: true
            },
            custom_name: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_name: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_tel: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_role: {
                type: verify.STRING,
                allowNull: true
            },
            remark: {
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
        const cus_contacts = await model.cus_contacts();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await cus_contacts.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await cus_contacts.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除客户
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "cus_contacts", callback);
    }

    module.exports.contacts = contacts;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();