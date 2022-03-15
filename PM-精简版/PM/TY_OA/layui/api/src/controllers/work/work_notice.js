"use strict";

/**
 * 消息通知
 */
(function () {

    const model = require("../../model/main")("work_notice", "work_notice_config", "work_notice_user", "prj_feedback_solution", "prj_feedback");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 获取消息通知
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const notice = async function (options, callback) {
        await action.findByPk(options, "work_notice", callback);
    }

    /**
     * 添加消息通知
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, response) {

        //获取消息配置
        const work_notice_config = await model.work_notice_config();
        const notice_config = await work_notice_config.findOne({ where: { ident: options.ident } });

        //判断是否需要写入数据库
        if (notice_config.storage === 0) {
            //不存数据库
            return notice_config.type;
        }

        //获取消息人员
        const work_notice_user = await model.work_notice_user();
        const notice_user = await work_notice_user.findAll({ where: { notice_id: notice_config.id } });

        var params = (notice_config.params_type === "request") ? options.data : JSON.stringify(response.data);

        var obj = {
            ident: notice_config.ident,
            batch: tools.uuid(),
            type: notice_config.type,
            title: notice_config.title,
            message: tools.placeholder(notice_config.describe, options.param).replace(/\"/g, "'"),
            params: params,
            creater_id: options.user_id,
            creater_name: options.user_name
        }
        var list = [];
        for (let i = 0; i < notice_user.length; i++) {
            const item = notice_user[i];
            var notice = tools.deepClone(obj);
            notice.receiver_id = item.user_id;
            notice.receiver_name = item.user_name;
            list.push(notice);
        }

        const work_notice = await model.work_notice();
        const data = await work_notice.bulkCreate(list);
        return notice_config.type;
    }

    /**
     * 获取消息通知列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {
        var verifyData = new verify.verifyData({
            ident: {
                type: {
                    type: [verify.STRING, verify.ARRAY],
                    allowNull: true
                },
                allowNull: true
            },
            receiver_id: {
                type: verify.STRING,
                allowNull: true
            },
            read_status: {
                type: verify.NUMBER,
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
        const work_notice = await model.work_notice();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            create_time: "DESC"
        });
        var params = condition.options;
        //设置模糊查询：项目状态
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.ident) && tools.isArray(options.ident)) {
            params.where.ident = {
                [Sequelize.Op.in]: options.ident
            }
        }

        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.creater_name)) {
            params.where.creater_name = {
                [Sequelize.Op.like]: "%" + options.creater_name + "%"
            }
        }
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.message)) {
            params.where.message = {
                [Sequelize.Op.like]: "%" + options.message + "%"
            }
        }
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.start_time)) {
            params.where.create_time = {
                [Sequelize.Op.gte]: options.start_time
            }
            delete params.where.start_time;
        }
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.end_time)) {
            params.where.create_time = {
                [Sequelize.Op.lte]: options.end_time
            }
            delete params.where.end_time;
        }

        var data = {};
        data.list = await work_notice.findAll(condition.getOptions());
        data.count = await work_notice.count(condition.getOptionsNoPage());

        /**
         * 根据不同请求类型
         * 请求其他关联数据
         */
        for (let i = 0; i < data.list.length; i++) {
            const item = data.list[i];
            switch (item.ident) {
                case "CreateFeedback":  //审核人员方案
                    const prj_feedback_solution = await model.prj_feedback_solution();
                    item.examine = await prj_feedback_solution.findAll({ where: { feedback_id: JSON.parse(item.params).id } });
                    //反馈信息
                    const prj_feedback = await model.prj_feedback();
                    item.feedback = await prj_feedback.findOne({ where: { id: JSON.parse(item.params).id } });
                    break;
            }
        }
        retry.findOne(data, callback);
    }

    /**
     * 修改消息通知
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: {
                type: [verify.STRING, verify.ARRAY],
                allowNull: true
            },
            read_status: verify.NUMBER
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const work_notice = await model.work_notice();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id", "batch"]);
        condition.setValues(params, ["id"]);

        var params = condition.options;
        //设置模糊查询：项目状态
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.id) && tools.isArray(options.id)) {
            params.where.id = {
                [Sequelize.Op.in]: options.id
            }
        }

        //修改数据
        const count = await work_notice.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await work_notice.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    module.exports.notice = notice;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.update = update;
})();