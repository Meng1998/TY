"use strict";

/**
 * 请假管理
 */
(function () {

    const model = require("../../model/main")("work_leave");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 添加请假
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            user_id: verify.STRING,
            user_name: verify.STRING,
            start_time: verify.DATETIME,
            end_time: verify.DATETIME,
            excues: verify.STRING,
            type: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const work_leave = await model.work_leave();
        const data = await work_leave.create(options);
        retry.create(data, callback);
    }

    /**
     * 获取请假列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {
        var verifyData = new verify.verifyData({
            user_id: {
                type: verify.STRING,
                allowNull: true
            },
            user_name: {
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
        const work_leave = await model.work_leave();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            create_time: "DESC"
        });

        var params = condition.options;
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.user_name)) {
            params.where.user_name = {
                [Sequelize.Op.like]: "%" + options.user_name + "%"
            }
        }
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.start_time)) {
            params.where.start_time = {
                [Sequelize.Op.gte]: options.start_time
            }
        }
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.end_time)) {
            params.where.end_time = {
                [Sequelize.Op.lte]: options.end_time
            }
        }

        var data = {};
        data.list = await work_leave.findAll(condition.getOptions());
        data.count = await work_leave.count(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 请假审批
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const approval = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            approval: verify.STRING,
            approver_id: verify.STRING,
            approver_name: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const work_leave = await model.work_leave();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await work_leave.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await work_leave.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除请假
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "work_leave", callback);
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.approval = approval;
    module.exports.destroy = destroy;
})();