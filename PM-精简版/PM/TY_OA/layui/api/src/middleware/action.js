"use strict";

/**
 * 模型操作
 */
(function () {

    const verify = require("./verify");
    const retry = require("./retry");
    const tools = require("../utils/tools");
    const Sequelize = require("../dao/sequelizeDao");

    /**
     * 根据主键查询数据
     * @param {object} options 传入参数
     * @param {object} modelName 模型名称
     * @param {function} callback 回调方法
     */
    async function findByPk(options, modelName, callback) {
        //验证提交数据
        var result = verify.execute(options, {
            id: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        const model = require("../model/main")(modelName);

        //定义模型
        const object = await model[modelName]();

        const data = await object.findByPk(options.id);
        retry.findOne(data, callback);
    }

    /**
     * 根据主键删除数据
     * @param {object} options 传入参数
     * @param {object} modelName 模型名称
     * @param {function} callback 回调方法
     */
    async function destroyByPk(options, modelName, callback) {
        //验证提交数据
        var result = verify.execute(options, {
            id: verify.STRING
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        const model = require("../model/main")(modelName);
        //定义模型
        const object = await model[modelName]();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options, ["id"]);

        const count = await object.destroy(condition.getOptions());

        retry.destroy(count, callback);
    }


    /**
     * 根据主键验证数据是否存在
     * @param {object} primaryKey 主键id
     * @param {object} modelName 模型名称
     * @returns 存在
     */
    async function existByPk(primaryKey, modelName) {
        const model = require("../model/main")(modelName);
        //定义模型
        const object = await model[modelName]();
        const data = await object.findByPk(primaryKey);
        return tools.isNotEmpty(data);
    }

    /**
     * 根据SQL语句进行查询
     * @param {string} sql SQL语句
     */
    async function query(sql, callback) {
        const sequelize = await Sequelize.initDB();
        const data = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
        retry.findAll(data, callback);
    }

    module.exports.findByPk = findByPk;
    module.exports.destroyByPk = destroyByPk;
    module.exports.existByPk = existByPk;
    module.exports.query = query;
})();