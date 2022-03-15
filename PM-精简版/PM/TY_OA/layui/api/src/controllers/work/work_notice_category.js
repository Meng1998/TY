"use strict";

/**
 * 消息通知类别
 */
(function () {

    const model = require("../../model/main")("work_notice_category", "work_notice_config");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取消息通知类别信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const notice_category = async function (options, callback) {
        await action.findByPk(options, "work_notice_category", callback);
    }

    /**
     * 添加消息通知类别
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            category_name: verify.STRING,
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

        const work_notice_category = await model.work_notice_category();
        const data = await work_notice_category.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改消息通知类别
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            category_name: verify.STRING,
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
        const work_notice_category = await model.work_notice_category();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await work_notice_category.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await work_notice_category.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 获取消息通知类别列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {
        //定义模型
        const work_notice_category = await model.work_notice_category();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            order: "ASC"
        });

        var data = {};
        data.list = await work_notice_category.findAll(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 删除消息通知类别
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        //定义模型
        const work_notice_config = await model.work_notice_config();
        const count = await work_notice_config.destroy({ where: { category_id: options.id } });
        //删除主键
        await action.destroyByPk(options, "work_notice_category", callback);
    }

    module.exports.notice_category = notice_category;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();