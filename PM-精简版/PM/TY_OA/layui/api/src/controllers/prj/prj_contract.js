"use strict";

/**
 * 合同信息
 */
(function () {

    const model = require("../../model/main")("prj_contract", "prj_info", "prj_payment", "prj_files");
    const constant = require("../../middleware/constant");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const io = require("../../utils/io");
    const config = require("config");
    const path = require('path');
    const fs = require("fs");

    /**
     * 获取合同列表
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const list = async function (options, callback) {

        //验证提交数据
        var verifyData = new verify.verifyData({

        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        //定义模型
        const prj_contract = await model.prj_contract();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            sign_time: "DESC"
        });

        var params = condition.options;
        //设置模糊查询：项目名称
        if (tools.isNotEmpty(options) && tools.isNotEmpty(options.project_name)) {
            params.where.project_name = {
                [Sequelize.Op.like]: "%" + options.project_name + "%"
            }
        }

        const list = await prj_contract.findAll(condition.getOptions());

        var data = {};
        data.list = list;
        data.count = await prj_contract.count(condition.getOptionsNoPage());

        for (let i = 0; i < list.length; i++) {
            const contract = list[i];
            //定义模型
            const prj_payment = await model.prj_payment();

            //验证条件
            var condition = new Sequelize.Options();
            condition.setWhere({ contract_id: contract.id });
            var payments = await prj_payment.findAll(condition.getOptionsNoPage());
            contract.payments = payments;
        }

        retry.findAll(data, callback);
    }

    /**
     * 添加合同
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, files, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING,
            project_code: verify.STRING,
            project_name: verify.STRING,
            custom_id: verify.STRING,
            custom_name: verify.STRING,
            sign_time: verify.DATE,
            amount: verify.STRING,
            delivery_time: verify.STRING,
            remark: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;
        options.receivable = options.amount;
        options.paid = 0;

        const prj_contract = await model.prj_contract();
        const contract = await prj_contract.create(options);

        //-------------------------合同附件
        const localpath = config.get("files.attachment");

        for (var file in files) {
            //源文件目录
            var sourcePath = files[file].path;
            //目标路径
            var destPath = path.join(localpath, data.project_code);
            //文件名
            var fileName = files[file].name;
            //复制文件
            io.copyFile(sourcePath, destPath, fileName);

            const prj_files = await model.prj_files();
            await prj_files.create({
                contract_id: contract.id,
                file_name: files[file].name,
                file_path: options.project_code + "/" + files[file].name
            });
        }

        //-------------------------修改项目状态
        //定义模型
        const prj_info = await model.prj_info();

        //修改数据
        const count = await prj_info.update(
            { contract_status: constant.contract.signed },
            { where: { id: options.project_id } }
        );

        //-------------------------添加付款条件
        //定义模型
        const prj_payment = await model.prj_payment();
        var rows = JSON.parse(options.payment);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            row.contract_id = contract.id;
        }
        const data = await prj_payment.bulkCreate(rows, {
            updateOnDuplicate: [
                "contract_id",
                "term",
                "amount"
            ]
        });

        retry.length(data, callback);
    }

    module.exports.list = list;
    module.exports.create = create;
})();