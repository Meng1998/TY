"use strict";

/**
 * 项目统计
 */
(function () {

    const model = require("../../model/main")("work_leave", "work_bustrip", "sys_user");
    const Sequelize = require("../../dao/sequelizeDao");
    const retry = require("../../middleware/retry");

    /**
     * 人员状态统计
     * @param {function} callback 回调方法
     */
    const status = async function (callback) {

        //查询条件
        var condition = new Sequelize.Options();
        condition.setOrder({
            create_time: "DESC"
        });

        var params = condition.options;
        params.where.start_time = {
            [Sequelize.Op.lte]: Date.now()
        }
        params.where.end_time = {
            [Sequelize.Op.gte]: Date.now()
        }

        //查询当前出差人员

        //定义模型
        const work_leave = await model.work_leave();
        var work_leave_data = await work_leave.findAll(condition.getOptions());

        //查询当前请假人员
        const work_bustrip = await model.work_bustrip();
        params.where.end_time = {
            [Sequelize.Op.eq]: null
        }
        var work_bustrip_data = await work_bustrip.findAll(condition.getOptions());

        const sys_user = await model.sys_user();
        condition = new Sequelize.Options();
        condition.setWhere({ job_status: "1" });
        params = condition.options;
        //移除系统管理员
        params.where.user_name = {
            [Sequelize.Op.ne]: "superadmin"
        }

        var total = await sys_user.count(condition.getOptionsNoPage());

        var data = {
            total: total,
            leave: {
                data: work_leave_data,
                count: work_leave_data.length
            },
            bustrip: {
                data: work_bustrip_data,
                count: work_bustrip_data.length
            }
        }

        retry.findOne(data, callback);
    }

    module.exports.status = status;
})();