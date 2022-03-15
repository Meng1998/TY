"use strict";

/**
 * 项目反馈
 */
(function () {

    const model = require("../../model/main")("prj_feedback", "prj_feedback_solution", "work_notice_user", "work_notice");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const action = require("../../middleware/action");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 获取项目反馈
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const feedback = async function (options, callback) {
        await action.findByPk(options, "prj_feedback", callback);
    }

    /**
     * 添加项目反馈
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING,
            project_name: verify.STRING,
            title: verify.STRING,
            type: verify.STRING,
            message: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const prj_feedback = await model.prj_feedback();
        const data = await prj_feedback.create(options);

        var obj = {
            feedback_id: data.id,
            feedback_title: data.title,
            feedback_message: data.message,
            project_id: data.project_id,
            project_name: data.project_name
        }

        //获取消息人员
        const work_notice_user = await model.work_notice_user();
        const notice_user = await work_notice_user.findAll({ where: { ident: "CreateFeedback" } });
        var list = [];
        for (let i = 0; i < notice_user.length; i++) {
            const item = notice_user[i];
            var solution = tools.deepClone(obj);
            solution.user_id = item.user_id;
            solution.user_name = item.user_name;
            list.push(solution);
        }

        //添加到方案人员
        const prj_feedback_solution = await model.prj_feedback_solution();
        const solutionList = await prj_feedback_solution.bulkCreate(list);

        retry.create(data, callback);
    }

    /**
     * 获取项目反馈
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: {
                type: verify.STRING,
                allowNull: true
            },
            status: {
                type: [verify.STRING, verify.ARRAY],
                allowNull: true
            },
            type: {
                type: verify.STRING,
                allowNull: true
            },
            creater_id: {
                type: verify.STRING,
                allowNull: true
            },
            assignor_id: {
                type: verify.STRING,
                allowNull: true
            },
            designee_id: {
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
        const prj_feedback = await model.prj_feedback();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            create_time: "DESC"
        });

        var params = condition.options;
        //设置模糊查询：项目名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.project_name)) {
            params.where.project_name = {
                [Sequelize.Op.like]: "%" + options.project_name + "%"
            }
        }
        //设置模糊查询：项目状态
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.status) && tools.isArray(options.status)) {
            params.where.status = {
                [Sequelize.Op.in]: options.status
            }
        }

        var data = {};

        data.list = await prj_feedback.findAll(condition.getOptions());
        data.count = await prj_feedback.count(condition.getOptionsNoPage());

        for (let i = 0; i < data.list.length; i++) {
            const item = data.list[i];
            const prj_feedback_solution = await model.prj_feedback_solution();
            const examine = await prj_feedback_solution.findAll({ where: { feedback_id: item.id } });
            item.examine = examine;
        }

        retry.findAll(data, callback);
    }

    /**
     * 获取项目反馈
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const feedbackByProject = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: {
                type: verify.STRING,
                allowNull: true
            },
            status: {
                type: [verify.STRING, verify.ARRAY],
                allowNull: true
            },
            type: {
                type: verify.STRING,
                allowNull: true
            },
            assignor_id: {
                type: verify.STRING,
                allowNull: true
            },
            designee_id: {
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
        const prj_feedback = await model.prj_feedback();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            create_time: "DESC"
        });

        var params = condition.options;
        //设置模糊查询：项目名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.project_name)) {
            params.where.project_name = {
                [Sequelize.Op.like]: "%" + options.project_name + "%"
            }
        }
        //设置模糊查询：项目状态
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.status) && tools.isArray(options.status)) {
            params.where.status = {
                [Sequelize.Op.in]: options.status
            }
        }

        //查询列表
        const feedback_list = await prj_feedback.findAll(condition.getOptions());
        for (let i = 0; i < feedback_list.length; i++) {
            const feedback = feedback_list[i];
            feedback.node_type = "feedback";
            feedback.text = feedback.title;
            feedback.feedback = true;
        }

        condition.getOptions();
        condition.setGroup("project_id");
        condition.setAttributes([["project_id", "id"], ["project_name", "text"]]);
        //查询所属项目
        const project_list = await prj_feedback.findAll(condition.getOptions());
        for (let i = 0; i < project_list.length; i++) {
            const project = project_list[i];
            project.node_type = "project";
        }
        var data = feedback_list.concat(project_list);
        var feedbackData = tools.tree(data, "project_id", true, "project");
        retry.findAll(feedbackData, callback);
    }

    /**
     * 修改反馈
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            status: {
                type: verify.STRING,
                allowNull: true
            },
            assignor_id: {
                type: verify.STRING,
                allowNull: true
            },
            assignor_name: {
                type: verify.STRING,
                allowNull: true
            },
            designee_id: {
                type: verify.STRING,
                allowNull: true
            },
            designee_name: {
                type: verify.STRING,
                allowNull: true
            },
            estimate_time: {
                type: verify.DATE,
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
        const prj_feedback = await model.prj_feedback();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await prj_feedback.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await prj_feedback.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 删除项目反馈
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        //删除prj_feedback_solution
        const prj_feedback_solution = await model.prj_feedback_solution();
        await prj_feedback_solution.destroy({ where: { feedback_id: options.id } });
        //删除work_notice
        const work_notice = await model.work_notice();
        await work_notice.destroy({ where: { params: { [Sequelize.Op.like]: "%" + options.id + "%" } } });

        await action.destroyByPk(options, "prj_feedback", callback);
    }

    module.exports.feedback = feedback;
    module.exports.create = create;
    module.exports.list = list;
    module.exports.feedbackByProject = feedbackByProject;
    module.exports.update = update;
    module.exports.destroy = destroy;
})();