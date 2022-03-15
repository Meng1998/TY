"use strict";

/**
 * 许可授权
 */
(function () {

    const model = require("../../model/main")("lic_authorize", "lic_project", "prj_info");
    const Sequelize = require("../../dao/sequelizeDao");
    const verify = require("../../middleware/verify");
    const action = require("../../middleware/action");
    const retry = require("../../middleware/retry");
    const tools = require("../../utils/tools");
    const io = require("../../utils/io");
    const config = require("config");
    const path = require('path');

    /**
     * 添加许可授权
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const create = async function (options, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING,
            project_name: verify.STRING,
            message: verify.STRING,
            machine_id: verify.STRING
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        delete options.id;

        const lic_authorize = await model.lic_authorize();
        const data = await lic_authorize.create(options);
        retry.create(data, callback);
    }

    /**
     * 获取许可授权
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
            project_name: {
                type: verify.STRING,
                allowNull: true
            },
            creater_id: {
                type: verify.STRING,
                allowNull: true
            },
            authorizer_id: {
                type: verify.STRING,
                allowNull: true
            },
            authorize_status: {
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
        const lic_authorize = await model.lic_authorize();

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

        var data = {};
        data.list = await lic_authorize.findAll(condition.getOptions());
        data.count = await lic_authorize.count(condition.getOptionsNoPage());

        retry.findAll(data, callback);
    }

    /**
     * 删除许可授权
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const destroy = async function (options, callback) {
        await action.destroyByPk(options, "lic_authorize", callback);
    }

    /**
     * 上传授权文件
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const upload = async function (options, files, callback) {
        //验证提交数据
        var verifyData = new verify.verifyData({
            project_id: verify.STRING,
            project_name: verify.STRING,
            authorizer_id: verify.STRING,
            authorizer_name: verify.STRING,
            machine_id: verify.STRING,
        });

        var result = verify.execute(options, verifyData);

        //验证结果
        if (!result.success) {
            callback(result);
            return;
        }

        options.authorize_status = "1";//授权状态
        options.start_time = (options.start_time ? options.start_time : Date.now());
        options.expire_time = (options.expire_time ? options.expire_time : Date.now());

        //定义模型
        const prj_info = await model.prj_info();
        const data = await prj_info.findByPk(options.project_id);

        //-------------------------合同附件
        const localpath = config.get("files.licence");

        for (var file in files) {
            //源文件目录
            var sourcePath = files[file].path;
            //目标路径
            var destPath = path.join(localpath, data.project_code);
            //文件名
            var fileName = tools.placeholder("MapVision3D_{0}_{1}.lic", [data.project_code, Date.now()]);
            //复制文件
            io.copyFile(sourcePath, destPath, fileName);

            //文件路径
            options.file_path = path.join(data.project_code, fileName);
        }

        //设置参数
        var params = tools.deepClone(options);

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(params, ["id"]);
        condition.setValues(params, ["id", "project_id", "project_name", "machine_id"]);

        //-------------------------修改授权状态
        //定义模型
        const lic_authorize = await model.lic_authorize();

        //修改数据
        const count = await lic_authorize.update(condition.getValues(), condition.getOptions());

        //定义模型
        const lic_project = await model.lic_project();
        const lic_prj = await lic_project.findByPk(options.project_id);
        if (lic_prj) {
            //修改
            await lic_project.update(
                { expire_time: options.expire_time },
                { where: { id: options.project_id } }
            );
        } else {
            //创建
            await lic_project.create({
                id: options.project_id,
                project_id: options.project_id,
                project_code: data.project_code,
                project_name: options.project_name,
                expire_time: options.expire_time
            });
        }

        await retry.update(count, async function () {
            const data = await lic_authorize.findByPk(options.id);
            retry.findOne(data, callback);
        }, callback);
    }

    /**
     * 获取授权文件下载路径
     * @param {object} options 传入参数
     * @param {function} callback 回调方法
     */
    const download = async function (options, callback) {
        //定义模型
        const lic_authorize = await model.lic_authorize();
        const data = await lic_authorize.findByPk(options.id);
        var address = tools.placeholder("{0}licence/{1}", [config.get("files.network"), data.file_path]);
        address = address.replace(/\\/g, "/");
        retry.findOne({
            address: address
        }, callback);
    }

    module.exports.create = create;
    module.exports.list = list;
    module.exports.upload = upload;
    module.exports.destroy = destroy;
    module.exports.download = download;
})();