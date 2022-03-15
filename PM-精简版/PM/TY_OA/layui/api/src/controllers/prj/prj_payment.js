"use strict";

/**
 * 合同信息
 */
(function () {

    const model = require("../../model/main")("prj_payment", "prj_contract");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 获取合同列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            contract_id: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const prj_payment = await model.prj_payment();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        const list = await prj_payment.findAll(condition.getOptions());
        
        var data = {};
        data.list = list;
        data.count = await prj_payment.count(condition.getOptionsNoPage());
        
        retry.findAll(data, callback);
    }

    /**
     * 修改收款
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            contract_id: verify.STRING,
            amount: {
                type: verify.NUMBER,
                allowNull: true
            },
            invoice_status: {
                type: verify.STRING,
                allowNull: true
            },
            collect_status: {
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

        /**
         * 修改付款信息
         */
        //定义模型
        const prj_payment = await model.prj_payment();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id", "contract_id", "amount"]);

        //修改数据
        const count = await prj_payment.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            if (options.collect_status) {
                //收款
                /**
                 * 修改合同信息
                 */
                const prj_contract = await model.prj_contract();
                const data = await prj_contract.findByPk(options.contract_id);
                data.paid += parseInt(options.amount);
                data.receivable = data.amount - data.paid;
                //修改数据
                const count = await prj_contract.update({
                    paid: data.paid,
                    receivable: data.receivable
                }, {
                    where: {
                        id: options.contract_id
                    }
                });

                await retry.update(count, async function () {
                    const data = await prj_contract.findByPk(options.contract_id);
                    retry.findOne(data, callback);
                }, callback);
            } else {
                //开票
                const data = await prj_payment.findByPk(options.id);
                retry.findOne(data, callback);
            }

        }, callback);


    }

    module.exports.list = list;
    module.exports.update = update;
})();