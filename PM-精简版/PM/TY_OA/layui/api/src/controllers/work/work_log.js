"use strict";

/**
 * 工作日志
 */
(function () {

    const model = require("../../model/main")("work_log");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 获取日志
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const log = async function (options, callback) {

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        //定义模型
        const work_log = await model.work_log();

        const data = await work_log.findOne(condition.getOptions());
        retry.findOne(data, callback);
    }

    /**
     * 添加日志
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            user_id: verify.STRING,
            user_name: verify.STRING,
            date: verify.DATE,
            content: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const work_log = await model.work_log();
        const data = await work_log.create(options);
        retry.create(data, callback);
    }

    /**
     * 获取日志列表
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
        const work_log = await model.work_log();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            date: "DESC"
        });

        var params = condition.options;
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.user_name)) {
            params.where.user_name = {
                [Sequelize.Op.like]: "%" + options.user_name + "%"
            }
        }
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.date)) {
            var clone = tools.deepClone(params.where);
            // params.where = Sequelize.where(Sequelize.fn('DATE_SUB', Sequelize.fn('CURDATE'), Sequelize.literal('INTERVAL 60 DAY')), '<=', Sequelize.fn('DATE', Sequelize.col('date')));
            params.where = [Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%Y%m'), '=', Sequelize.fn('DATE_FORMAT', options.date, '%Y%m'))];
            for (var p in clone) {
                if (p !== "date") {
                    params.where.push({
                        [p]: clone[p]
                    });
                }
            }
        }

        var data = {};
        data.list = await work_log.findAll(condition.getOptions());
        data.count = await work_log.count(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 修改日志
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            user_id: verify.STRING,
            user_name: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const work_log = await model.work_log();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await work_log.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await work_log.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    module.exports.log = log;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
})();