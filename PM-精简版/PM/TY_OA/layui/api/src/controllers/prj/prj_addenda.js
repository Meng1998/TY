"use strict";

/**
 * 项目补充
 */
(function () {

    const model = require("../../model/main")("prj_addenda");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const action = require("../../middleware/action");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 添加项目补充
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

        const prj_addenda = await model.prj_addenda();
        const data = await prj_addenda.create(options);
        retry.create(data, callback);
    }

    /**
     * 获取项目补充
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
        const prj_addenda = await model.prj_addenda();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            create_time: "DESC"
        });

        var data = {};

        data.list = await prj_addenda.findAll(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 修改项目补充
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            project_id: verify.STRING,
            important: {
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
        const prj_addenda = await model.prj_addenda();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await prj_addenda.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await prj_addenda.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除项目补充
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "prj_addenda", callback);
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();