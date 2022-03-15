"use strict";

/**
 * 差旅管理
 */
(function () {

    const model = require("../../model/main")("work_bustrip");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 添加差旅
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            user_id: verify.STRING,
            user_name: verify.STRING,
            start_time: verify.DATE,
            excues: {
                type: verify.STRING,
                allowNull: true
            },
            type: verify.STRING,
            project_id: {
                type: verify.STRING,
                allowNull: true
            },
            project_name: {
                type: verify.STRING,
                allowNull: true
            },
            custom_id: verify.STRING,
            custom_name: verify.STRING,
            contacts_name: verify.STRING,
            contacts_tel: verify.STRING,
            province: verify.STRING,
            province_name: verify.STRING,
            city: verify.STRING,
            city_name: verify.STRING,
            county: {
                type: verify.STRING,
                allowNull: true
            },
            county_name: {
                type: verify.STRING,
                allowNull: true
            },
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

        const work_bustrip = await model.work_bustrip();
        const data = await work_bustrip.create(options);
        retry.create(data, callback);
    }

    /**
     * 获取请假差旅
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {
        var verifyData = new verify.verifyData({
            user_id: {
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
        const work_bustrip = await model.work_bustrip();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            start_time: "DESC"
        });

        var params = condition.options;
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.user_name)) {
            params.where.user_name = {
                [Sequelize.Op.like]: "%" + options.user_name + "%"
            }
        }

        var data = {};
        data.list = await work_bustrip.findAll(condition.getOptions());
        data.count = await work_bustrip.count(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 结束差旅
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const end = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const work_bustrip = await model.work_bustrip();

        //设置参数
        var params = tools.deepClone(options);

        params.end_time = Date.now();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await work_bustrip.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await work_bustrip.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 修改差旅
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const work_bustrip = await model.work_bustrip();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await work_bustrip.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await work_bustrip.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除出差
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "work_bustrip", callback);
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.end = end;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();