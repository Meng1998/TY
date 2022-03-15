"use strict";

/**
 * 项目统计
 */
(function () {

    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");

    /**
     * 获取项目分布
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const distrib = async function (options, callback) {
        //验证请求数据
        var result = verify.execute(options, {
            project_status: verify.ARRAY,
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        var project_status = "";
        for (let i = 0; i < options.project_status.length; i++) {
            const item = options.project_status[i];
            project_status += tools.placeholder(",sum(case when prj.project_status={op_value} then 1 else 0 end ) {dic_identity}", item);
        }

        const sequelize = await Sequelize.initDB();
        var sql = tools.placeholder("select reg.`name`, reg.id as code, if(prj.id is not null, count(*), 0) as value {project_status} from sys_region reg left join prj_info prj on prj.province = reg.id where reg.pid = '100000' group by reg.id order by value desc", { project_status: project_status });
        const data = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });

        retry.findAll(data, callback);
    }

    /**
     * 获取项目状态
     * @param {function} callback 回调方法
     */
    const status = async function (callback) {
        const sequelize = await Sequelize.initDB();
        var sql = "select project_status,count(*) as value from `prj_info` group by project_status";
        const data = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });

        retry.findAll(data, callback);
    }

    /**
     * 获取项目合同
     * @param {function} callback 回调方法
     */
    const contract = async function (options, callback) {
        //验证请求数据
        var result = verify.execute(options, {
            project_status: verify.ARRAY,
        });

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        const sequelize = await Sequelize.initDB();
        var project_status = "";
        //合同只在进行项目或完结项目中查询
        for (let i = 0; i < options.project_status.length; i++) {
            const item = options.project_status[i];
            project_status += item + ",";
        }
        project_status = project_status.substr(0, project_status.length - 1)
        var sql = tools.placeholder("select contract_status,count(*) as value from `prj_info` where project_status in ({project_status}) group by contract_status", { project_status: project_status });
        const data = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });

        retry.findAll(data, callback);
    }

    module.exports.distrib = distrib;
    module.exports.status = status;
    module.exports.contract = contract;
})();