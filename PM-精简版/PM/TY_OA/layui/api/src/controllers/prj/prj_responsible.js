"use strict";

/**
 * 项目负责人
 */
(function () {

    const model = require("../../model/main")("prj_responsible");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取项目负责人列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //定义模型
        const prj_responsible = await model.prj_responsible();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        var data = {};
        data.list = await prj_responsible.findAll();

        retry.findAll(data, callback);
    }

    /**
     * 添加项目负责人
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            user_id: verify.STRING,
            user_name: verify.STRING,
            full_name: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        const prj_responsible = await model.prj_responsible();
        const data = await prj_responsible.create(options);
        retry.create(data, callback);
    }

    /**
     * 删除项目负责人
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "prj_responsible", callback);
    }

    module.exports.list = list;
    module.exports.create = create;
    module.exports.destroy = destroy;
})();