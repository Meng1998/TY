"use strict";

/**
 * 客户信息
 */
(function () {

    const model = require("../../model/main")("cus_info");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取客户信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const info = async function (options, callback) {
        await action.findByPk(options, "cus_info", callback);
    }

    /**
     * 获取客户列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            custom_name: {
                type: verify.STRING,
                allowNull: true
            },
            custom_address: {
                type: verify.STRING,
                allowNull: true
            },
            province: {
                type: verify.STRING,
                allowNull: true
            },
            city: {
                type: verify.STRING,
                allowNull: true
            },
            county: {
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
        const cus_info = await model.cus_info();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        var params = condition.options;
        //设置模糊查询：客户名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.custom_name)) {
            params.where.custom_name = {
                [Sequelize.Op.like]: "%" + options.custom_name + "%"
            }
        }
        //设置模糊查询：客户地址
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.custom_address)) {
            params.where.custom_address = {
                [Sequelize.Op.like]: "%" + options.custom_address + "%"
            }
        }

        var data = {};
        data.list = await cus_info.findAll(condition.getOptions());
        data.count = await cus_info.count(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 添加客户
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            custom_name: verify.STRING,
            custom_address: verify.STRING,
            province: verify.STRING,
            province_name: verify.STRING,
            city: verify.STRING,
            city_name: verify.STRING,
            county: verify.STRING,
            county_name: verify.STRING,
            remark: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const cus_info = await model.cus_info();
        const data = await cus_info.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改客户
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            custom_name: verify.STRING,
            custom_address: verify.STRING,
            province: verify.STRING,
            province_name: verify.STRING,
            city: verify.STRING,
            city_name: verify.STRING,
            county: verify.STRING,
            county_name: verify.STRING,
            remark: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const cus_info = await model.cus_info();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await cus_info.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await cus_info.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除客户
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "cus_info", callback);
    }
    
    module.exports.info = info;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();