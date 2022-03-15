"use strict";

/**
 * 角色功能
 */
(function () {

    const model = require("../../model/main")("sys_action", "sys_role_action");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 根据角色获取所有功能列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const actionAuthRole = async function (options, callback) {

        //获取已分配功能
        var result = verify.execute(options, {
            role_id: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }
        const sequelize = await Sequelize.initDB();
        var sql = tools.placeholder("select * from sys_role_action where role_id = '{role_id}'", options);
        const dataAuth = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });

        //获取所有功能
        var condition = new Sequelize.Options();
        condition.setOrder({
            order: "ASC"
        });

        //定义模型
        const sys_action = await model.sys_action();
        const actions = await sys_action.findAll(condition.getOptions());

        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            var check = false;
            for (let j = 0; j < dataAuth.length; j++) {
                const auth = dataAuth[j];
                if (action.id === auth.action_id) {
                    action.checked = check = true;
                }
            }
            if (!check) {
                action.checked = false;
            }

            //替换属性
            action.text = action.action_name;
            action.pid = action.action_parent;
            action.iconCls = action.action_icon;
        }

        var data = tools.tree(actions);
        retry.findOne(data, callback);
    }

    /**
     * 配置角色功能
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const actionChange = async function (options, callback) {
        //验证请求数据
        var result = verify.execute(options, {
            role_id: verify.STRING
        });

        /**
         * 判断 options.data 数据类型
         * length大于20时，node会将 options.data 将会变为object
         */
        if (tools.isObject(options.data)) {
            var arr = [];
            for (var item in options.data) {
                arr.push(options.data[item]);
            }
            options.data = arr
        }

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_role_action = await model.sys_role_action();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options, ["role_id"]);
        //删除原有配置
        const count = await sys_role_action.destroy(condition.getOptions());

        //添加配置
        const data = await sys_role_action.bulkCreate(options.data);

        retry.length(data, callback);
    }

    /**
     * 获取功能所分配的角色
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const roleForAction = async function (options, callback) {
        //验证请求数据
        var result = verify.execute(options, {
            action_id: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        const sequelize = await Sequelize.initDB();
        var sql = tools.placeholder("select ra.id as 'ra_id',r.id,r.role_name,!ISNULL(ra.role_id) as authorise from sys_role r left join (select id,role_id from sys_role_action where action_id = '{action_id}') ra on r.id = ra.role_id", options);
        const query = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
        var data = {};
        data.list = query;

        retry.findAll(data, callback);
    }

    /**
     * 编辑功能权限
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const editRoleAction = async function (options, callback) {
        //验证请求数据
        var result = verify.execute(options, {
            id: {
                type: verify.STRING,
                allowNull: true
            },
            role_id: verify.STRING,
            action_id: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        if (tools.isNotEmpty(options.id)) {
            //删除子节点
            await action.destroyByPk(options, "sys_role_action", callback);
        } else {
            //添加
            const sys_role_action = await model.sys_role_action();
            const data = await sys_role_action.create(options);
            retry.create(data, callback);
        }
    }

    module.exports.actionAuthRole = actionAuthRole;
    module.exports.actionChange = actionChange;
    module.exports.roleForAction = roleForAction;
    module.exports.editRoleAction = editRoleAction;
})();