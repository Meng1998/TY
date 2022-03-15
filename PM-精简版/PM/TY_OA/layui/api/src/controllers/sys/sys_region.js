"use strict";

/**
 * 行政区划
 */
(function () {

    const model = require("../../model/main")("sys_region");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");

    /**
     * 获取行政区划
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            //pid: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const sys_region = await model.sys_region();

        if (options.postType === "1") {
            options.id = options.pid;
            delete options.pid;
        } else if (options.postType === "3") {
            //查询
            const rlt = await sys_region.findByPk(options.pid);
            options.pid = rlt.pid;
            //delete options.currNodeId;
        }
        delete options.postType;

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        const list = await sys_region.findAll(condition.getOptionsNoPage());
        retry.findAll(list, callback);
    }

    module.exports.list = list;
})();