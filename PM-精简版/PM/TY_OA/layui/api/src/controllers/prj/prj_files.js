"use strict";

/**
 * 合同附件
 */
(function () {

    const model = require("../../model/main")("prj_files");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");

    /**
     * 获取合同附件列表
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
        const prj_files = await model.prj_files();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        const list = await prj_files.findAll(condition.getOptions());
        retry.findAll(list, callback);
    }

    module.exports.list = list;
})();