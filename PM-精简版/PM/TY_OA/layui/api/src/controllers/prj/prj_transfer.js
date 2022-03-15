"use strict";

/**
 * 项目移交
 */
(function () {

    const model = require("../../model/main")("prj_transfer", "prj_info");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 添加项目移交
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING,
            project_name: verify.STRING,
            transferor_id: verify.STRING,
            transferor_name: verify.STRING,
            receiver_id: verify.STRING,
            receiver_name: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //修改项目信息
        //定义模型
        const prj_info = await model.prj_info();

        var condition = new Sequelize.Options();
        condition.setWhere({ id: options.project_id });
        condition.setValues({
            responsible_id: options.receiver_id,
            responsible_name: options.receiver_name
        });

        //修改数据
        const count = await prj_info.update(condition.getValues(), condition.getOptionsNoPage());

        await retry.update(count, async function () {
            //创建项目移交记录
            //定义模型
            const prj_transfer = await model.prj_transfer();
            const data = await prj_transfer.create(options);
            retry.create(data, callback);
        }, callback);
    }

    /**
     * 获取项目移交
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
        const prj_transfer = await model.prj_transfer();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            transfer_time: "DESC"
        });

        const list = await prj_transfer.findAll(condition.getOptionsNoPage());
        retry.findAll(list, callback);
    }

    module.exports.create = create;
    module.exports.list = list;
})();