"use strict";

/**
 * 项目信息
 */
(function () {

    const model = require("../../model/main")("prj_info", "prj_dynamic", "prj_addenda", "prj_feedback", "prj_contract");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const action = require("../../middleware/action");

    /**
     * 获取项目信息
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const info = async function (options, callback) {
        await action.findByPk(options, "prj_info", callback);
    }

    /**
     * 获取项目列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({
            project_name: {
                type: verify.STRING,
                allowNull: true
            },
            project_type: {
                type: verify.STRING,
                allowNull: true
            },
            project_status: {
                type: [verify.STRING, verify.ARRAY],
                allowNull: true
            },
            contract_status: {
                type: [verify.STRING, verify.ARRAY],
                allowNull: true
            },
            person_name: {
                type: verify.STRING,
                allowNull: true
            },
            custom_name: {
                type: verify.STRING,
                allowNull: true
            },
            start_time: {
                type: verify.STRING,
                allowNull: true
            },
            end_time: {
                type: verify.STRING,
                allowNull: true
            },
            province: {
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
        const prj_info = await model.prj_info();

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
        //设置模糊查询：客户名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.custom_name)) {
            params.where.custom_name = {
                [Sequelize.Op.like]: "%" + options.custom_name + "%"
            }
        }
        //设置模糊查询：客户联系人
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.contacts_name)) {
            params.where.contacts_name = {
                [Sequelize.Op.like]: "%" + options.contacts_name + "%"
            }
        }
        //设置模糊查询：项目经理
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.person_name)) {
            params.where.person_name = {
                [Sequelize.Op.like]: "%" + options.person_name + "%"
            }
        }
        //设置模糊查询：项目状态
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.project_status) && tools.isArray(options.project_status)) {
            params.where.project_status = {
                [Sequelize.Op.in]: options.project_status
            }
        }
        //设置模糊查询：合同状态
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.contract_status) && tools.isArray(options.contract_status)) {
            params.where.contract_status = {
                [Sequelize.Op.in]: options.contract_status
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

        const list = await prj_info.findAll(condition.getOptions());

        //定义模型
        const prj_feedback = await model.prj_feedback();
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            var numModel = await prj_feedback.count({ where: { project_id: item.id, type: "1", status: "0" } });
            var numDevelop = await prj_feedback.count({ where: { project_id: item.id, type: "2", status: "0" } });
            item.feedback = numModel + "/" + numDevelop
        }

        //定义模型
        const prj_addenda = await model.prj_addenda();
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            var num = await prj_addenda.count({ where: { project_id: item.id } });
            item.addenda = num;
        }

        //定义模型
        const prj_dynamic = await model.prj_dynamic();
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            var dynamic = await prj_dynamic.findOne({ where: { project_id: item.id }, order: [["dynamic_time", "DESC"]] });
            if (dynamic) {
                item.dynamic = dynamic.dynamic_time;
            }
        }

        var data = {};

        data.list = list;
        data.count = await prj_info.count(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 添加项目
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_code: verify.STRING,
            project_name: verify.STRING,
            project_type: verify.STRING,
            geojson: verify.TEXT,
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
            custom_id: verify.STRING,
            custom_name: verify.STRING,
            custom_address: verify.STRING,
            contacts_name: verify.STRING,
            contacts_tel: verify.STRING,
            creater_id: verify.STRING,
            creater_name: verify.STRING,
            follow_status: verify.STRING,
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

        const prj_info = await model.prj_info();
        /**
         * 生成项目编码
         */
        //获取最大项目编码
        var condition = new Sequelize.Options();
        condition.setAttributes(["project_code"]);
        condition.setOrder({
            project_code: "DESC"
        });

        var params = condition.options;
        //设置模糊查询
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.project_code)) {
            params.where.project_code = {
                [Sequelize.Op.like]: "%" + options.project_code + "%"
            }
        }

        const project = await prj_info.findOne(condition.getOptions());
        if (tools.isEmpty(project)) {
            options.project_code += (options.project_type + "001");
        } else {
            var num = parseInt(project.project_code);
            options.project_code = (num + 1) + "";
        }

        options.responsible_id = options.creater_id;
        options.responsible_name = options.creater_name;

        const data = await prj_info.create(options);
        retry.create(data, callback);
    }

    /**
     * 修改项目
     * @param {array} options 传入参数
     * @param {function} callback 回调方法
     */
    const update = async function (options, callback) {
        var verifyData = new verify.verifyData({
            id: verify.STRING,
            project_name: {
                type: verify.STRING,
                allowNull: true
            },
            project_type: {
                type: verify.STRING,
                allowNull: true
            },
            geojson: {
                type: verify.STRING,
                allowNull: true
            },
            project_type: {
                type: verify.STRING,
                allowNull: true
            },
            project_type: {
                type: verify.STRING,
                allowNull: true
            },
            province: {
                type: verify.STRING,
                allowNull: true
            },
            province_name: {
                type: verify.STRING,
                allowNull: true
            },
            city: {
                type: verify.STRING,
                allowNull: true
            },
            city_name: {
                type: verify.STRING,
                allowNull: true
            },
            county: {
                type: verify.STRING,
                allowNull: true
            },
            county_name: {
                type: verify.STRING,
                allowNull: true
            },
            custom_id: {
                type: verify.STRING,
                allowNull: true
            },
            custom_name: {
                type: verify.STRING,
                allowNull: true
            },
            custom_address: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_name: {
                type: verify.STRING,
                allowNull: true
            },
            contacts_tel: {
                type: verify.STRING,
                allowNull: true
            },
            project_status: {
                type: verify.STRING,
                allowNull: true
            },
            follow_status: {
                type: verify.STRING,
                allowNull: true
            },
            person_id: {
                type: verify.STRING,
                allowNull: true
            },
            person_name: {
                type: verify.STRING,
                allowNull: true
            },
            contract_status: {
                type: verify.STRING,
                allowNull: true
            },
            finished_date: {
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

        //定义模型
        const prj_info = await model.prj_info();

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id"]);

        //修改数据
        const count = await prj_info.update(condition.getValues(), condition.getOptions());

        await retry.update(count, async function () {
            const data = await prj_info.findByPk(options.id);
            //查询合同是否已签
            if (data.contract_status === "1") {
                //定义模型
                const prj_contract = await model.prj_contract();
                const contract = await prj_contract.findOne({ where: { project_id: data.id } });

                if (data.custom_id !== contract.custom_id) {
                    //修改合同
                    const count = await prj_contract.update({ custom_id: data.custom_id, custom_name: data.custom_name }, { where: { project_id: data.id } });
                }
            }
            retry.findOne(data, callback);
        }, callback);
    }

    module.exports.info = info;
    module.exports.list = list;
    module.exports.create = create;
    module.exports.update = update;
})();