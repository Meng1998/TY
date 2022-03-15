"use strict";

/**
 * 消息通知人员配置
 */
(function () {

    const model = require("../../model/main")("work_notice_user");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const action = require("../../middleware/action");
    const tools = require("../../utils/tools");

    /**
     * 添加消息通知人员配置
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            notice_id: verify.STRING,
            notice_title: verify.STRING,
            data: [verify.ARRAY, verify.STRING]
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const work_notice_user = await model.work_notice_user();
        //删除原有 notice_id
        const count = await work_notice_user.destroy({ where: { notice_id: options.notice_id } });
        if (!tools.isArray(options.data)) {
            options.data = JSON.parse(options.data);
        }
        var list = [];
        for (let i = 0; i < options.data.length; i++) {
            const item = options.data[i];
            list.push({
                notice_id: options.notice_id,
                notice_title: options.notice_title,
                ident: options.ident,
                role_id: item.role_id,
                user_role: item.user_role,
                user_id: item.user_id,
                user_name: item.user_name,
                head_img: item.head_img
            });
        }

        const data = await work_notice_user.bulkCreate(list);
        retry.bulkCreate(data, callback);
    }

    /**
     * 获取消息通知人员配置列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {
        var verifyData = new verify.verifyData({
            notice_id: verify.STRING,
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }
        //定义模型
        const work_notice_user = await model.work_notice_user();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);

        var data = {};
        data.list = await work_notice_user.findAll(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    /**
     * 删除消息通知人员配置
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "work_notice_user", callback);
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.destroy = destroy;
})();