"use strict";

/**
 * 系统部门
 */
(function () {

    const model = require("../../model/main")("sys_department");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取部门信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const department = async function (options, callback) {
        await action.findByPk(options, "sys_department", callback);
    }

    /**
     * 获取部门列表
     * @param {function} callback 回调方法
     */
    const list = async function (callback) {

        //验证条件
        var condition = new Sequelize.Options();
        condition.setOrder({
            order: "ASC"
        })

        //定义模型
        const sys_department = await model.sys_department();
        const departments = await sys_department.findAll(condition.getOptions());
        for (let i = 0; i < departments.length; i++) {
            const department = departments[i];
            department.name = department.dept_name;
            department.pid = department.dept_parent;
        }
        var data = tools.tree(departments);
        retry.findOne(data, callback);
    }

    /**
     * 添加部门
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            dept_name: verify.STRING,
            dept_parent: verify.STRING,
            order: verify.STRING,
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

        const sys_department = await model.sys_department();
        const data = await sys_department.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改部门
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {

        var verifyData = new verify.verifyData({
            id: verify.STRING,
            dept_name: verify.STRING,
            dept_parent: verify.STRING,
            order: verify.STRING,
            leader_id: {
                type: verify.STRING,
                allowNull: true
            },
            leader_name: {
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
        const sys_department = await model.sys_department();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await sys_department.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await sys_department.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除部门
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "sys_department", callback);
    }

    module.exports.department = department;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();