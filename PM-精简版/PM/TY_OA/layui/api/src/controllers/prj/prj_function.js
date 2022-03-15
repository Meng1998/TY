"use strict";

/**
 * 功能需求
 */
(function () {

    const model = require("../../model/main")("prj_function");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const action = require("../../middleware/action");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 添加功能需求
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING,
            project_name: verify.STRING,
            title: verify.STRING,
            message: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const prj_function = await model.prj_function();
        const data = await prj_function.create(options);
        retry.create(data, callback);
    }

    /**
     * 获取功能需求
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const prj_function = await model.prj_function();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            create_time: "ASC"
        });

        var data = {};

        data.list = await prj_function.findAll(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 修改功能需求
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            project_id: verify.STRING,
            status: {
                type: verify.NUMBER,
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
        const prj_function = await model.prj_function();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await prj_function.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await prj_function.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除功能需求
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "prj_function", callback);
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();