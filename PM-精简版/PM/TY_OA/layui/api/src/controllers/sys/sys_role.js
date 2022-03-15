"use strict";

/**
 * 系统角色
 */
(function () {

    const model = require("../../model/main")("sys_role", "sys_department");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取角色信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const role = async function (options, callback) {
        await action.findByPk(options, "sys_role", callback);
    }

    /**
     * 部门角色
     * @param {function} callback 回调方法
     */
    const rolesRegion = async function (callback) {

        var condition = new Sequelize.Options();
        condition.setOrder({
            order: "ASC"
        });

        //查询部门
        const sys_department = await model.sys_department();
        var departments = await sys_department.findAll(condition.getOptions());
        for (let i = 0; i < departments.length; i++) {
            i
            const dept = departments[i];

            dept.name = dept.dept_name;
            dept.pid = dept.dept_parent;
        }

        //查询角色
        const sys_role = await model.sys_role();
        var roles = await sys_role.findAll(condition.getOptions());
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];

            role.name = role.role_name;
            role.pid = role.dept_id;
            role.role = true;
        }

        //合并数据
        var data = departments.concat(roles);
        var rolesRegion = tools.tree(data);

        retry.findAll(rolesRegion, callback);
    }

    /**
     * 添加角色
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            role_name: verify.STRING,
            dept_id: verify.STRING,
            dept_name: verify.STRING,
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

        const sys_role = await model.sys_role();
        const data = await sys_role.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改角色
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {

        var verifyData = new verify.verifyData({
            id: verify.STRING,
            role_name: verify.STRING,
            dept_id: verify.STRING,
            dept_name: verify.STRING,
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

        //定义模型
        const sys_role = await model.sys_role();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await sys_role.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await sys_role.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除角色
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "sys_role", callback);
    }

    module.exports.role = role;
    module.exports.rolesRegion = rolesRegion;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();