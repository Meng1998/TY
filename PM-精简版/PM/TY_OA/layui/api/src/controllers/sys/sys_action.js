"use strict";

/**
 * 系统用户
 */
(function () {

    const model = require("../../model/main")("sys_action", "sys_role_action");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 根据角色获取功能列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const actionByRole = async function login(options, callback) {
        //验证请求数据
        var result = verify.execute(options, {
            role_id: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        const sequelize = await Sequelize.initDB();
        var sql = tools.placeholder("select ac.*, action_title as text, action_icon as iconCls, action_parent as pid from sys_action ac,sys_role_action ro_ac where ac.id=ro_ac.action_id and ro_ac.role_id = '{role_id}' and ac.action_enable = 1 order by ac.order", options);
        const data = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });

        var action = tools.tree(data);
        retry.findAll(action, callback);
    }

    /**
     * 获取功能列表
     * @param {function} callback 回调方法
     */
    const list = async function (callback) {

        //验证条件
        var condition = new Sequelize.Options();
        condition.setOrder({
            order: "ASC"
        });

        //定义模型
        const sys_action = await model.sys_action();
        const actions = await sys_action.findAll(condition.getOptions());
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            action.name = action.action_name;
            action.pid = action.action_parent;
            action.iconCls = action.action_icon;
        }
        var data = tools.tree(actions);
        retry.findOne(data, callback);
    }

    /**
     * 获取功能信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const _action = async function (options, callback) {
        await action.findByPk(options, "sys_action", callback);
    }

    /**
     * 添加功能
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {

        if (!options.action_enable) {
            options.action_enable = "0";
        }

        //验证提交数据
        var verifyData = new verify.verifyData({
            action_name: verify.STRING,
            action_title: verify.STRING,
            action_intent: {
                type: verify.STRING,
                allowNull: true
            },
            action_parent: verify.STRING,
            action_enable: verify.STRING,
            action_icon: {
                type: verify.STRING,
                allowNull: true
            },
            order: {
                type: verify.NUMBER,
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

        delete options.id;

        const sys_action = await model.sys_action();
        const data = await sys_action.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改功能
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {

        var verifyData = new verify.verifyData({
            id: verify.STRING,
            action_name: {
                type: verify.STRING,
                allowNull: true
            },
            action_title: {
                type: verify.STRING,
                allowNull: true
            },
            action_intent: {
                type: verify.STRING,
                allowNull: true
            },
            action_parent: {
                type: verify.STRING,
                allowNull: true
            },
            action_enable: {
                type: verify.STRING,
                allowNull: true
            },
            action_icon: {
                type: verify.STRING,
                allowNull: true
            },
            order: {
                type: verify.NUMBER,
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
        const sys_action = await model.sys_action();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await sys_action.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await sys_action.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除功能
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "sys_action", callback);
    }

    module.exports.actionByRole = actionByRole;
    module.exports.action = _action;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();