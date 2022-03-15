"use strict";

/**
 * 项目反馈方案
 */
(function () {

    const model = require("../../model/main")("prj_feedback_solution");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 获取项目反馈方案
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({

        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const prj_feedback_solution = await model.prj_feedback_solution();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        var data = {};
        data.list = await prj_feedback_solution.findAll(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 修改反馈方案
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            solution: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const prj_feedback_solution = await model.prj_feedback_solution();

        //设置当前时间
        options.update_time = Date.now();
        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await prj_feedback_solution.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await prj_feedback_solution.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    module.exports.list = list;
    module.exports.update = update;
})();