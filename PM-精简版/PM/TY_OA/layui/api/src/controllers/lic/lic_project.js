"use strict";

/**
 * 授权项目
 */
(function () {

    const model = require("../../model/main")("lic_project", "prj_info", "prj_contract", "prj_payment");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");


    /**
     * 获取授权项目列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            project_name: {
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
        const lic_project = await model.lic_project();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            expire_time: "ASC"
        });

        var params = condition.options;
        //设置模糊查询：项目名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.project_name)) {
            params.where.project_name = {
                [Sequelize.Op.like]: "%" + options.project_name + "%"
            }
        }

        var data = {};
        data.list = await lic_project.findAll(condition.getOptions());
        data.count = await lic_project.count(condition.getOptionsNoPage());

        for (let i = 0; i < data.list.length; i++) {
            const item = data.list[i];
            //项目信息
            const prj_info = await model.prj_info();
            const info = await prj_info.findByPk(item.project_id);
            item.contract_status = info.contract_status;
            item.custom_name = info.custom_name;

            //合同信息
            const prj_contract = await model.prj_contract();
            const contract = await prj_contract.findOne({ where: { project_id: item.project_id } });
       
            //判断合同是否已签
            if (contract) {
                item.amount = contract.amount;
                //定义模型
                const prj_payment = await model.prj_payment();

                //验证条件
                var condition = new Sequelize.Options();
                condition.setWhere({ contract_id: contract.id });
                var payments = await prj_payment.findAll(condition.getOptionsNoPage());
                item.payments = payments;
            }
        }

        retry.findAll(data, callback);
    }

    module.exports.list = list;
})();