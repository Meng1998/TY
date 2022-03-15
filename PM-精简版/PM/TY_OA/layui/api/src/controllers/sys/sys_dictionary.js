"use strict";

/**
 * 系统字典
 */
(function () {

    const model = require("../../model/main")("sys_dictionary");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取字典信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const dictionary = async function (options, callback) {
        await action.findByPk(options, "sys_dictionary", callback);
    }

    /**
     * 添加字典
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            pid: verify.STRING,
            dic_name: verify.STRING,
            op_value: verify.STRING,
            order: verify.NUMBER,
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

        const sys_dictionary = await model.sys_dictionary();
        const data = await sys_dictionary.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改字典
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            pid: verify.STRING,
            dic_name: verify.STRING,
            op_value: verify.STRING,
            order: verify.STRING,
            remark: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_dictionary = await model.sys_dictionary();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await sys_dictionary.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await sys_dictionary.findByPk(options.id);
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
            dic_name: {
                type: verify.STRING,
                allowNull: true
            },
            pid: {
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
        const sys_dictionary = await model.sys_dictionary();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            order: "ASC"
        });

        var params = condition.options;
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.dic_name)) {
            params.where.dic_name = {
                [Sequelize.Op.like]: "%" + options.dic_name + "%"
            }
        }

        var data = {};
        data.list = await sys_dictionary.findAll(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 删除字典
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        //定义模型
        const sys_dictionary = await model.sys_dictionary();
        const count = await sys_dictionary.destroy({ where: { pid: options.id } });

        //删除主键
        await action.destroyByPk(options, "sys_dictionary", callback);
    }

    module.exports.dictionary = dictionary;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();