"use strict";

/**
 * 系统操作日志
 */
(function () {

    const model = require("../../model/main")("sys_log");
    const tools = require("../../utils/tools");

    /**
     * 添加日志
     * @param {object} options 日志信息
     */
    const writeLog = async function (options) {

        /**
         * 设置对象Base64属性值
         * @param {any} data 传入参数
         */
        function setBase64Property(data) {

            //获取数据类型
            const dataType = tools.dataType(data);

            switch (dataType) {
                case "[object Object]": //对象
                    setValue(data);
                    break;
                case "[object Array]":  //数组
                    data.forEach(item => {
                        setValue(item);
                    });
                    break;
            }

            /**
             * 将Base64格式属性值改为 data:image/png;base64
             * @description 减小入库数据量
             * @param {string} data 属性值
             */
            function setValue(data) {
                //遍历属性
                for (var property in data) {
                    if (tools.dataType(data[property]) === "[object String]" && tools.isBase64(data[property])) {
                        data[property] = "data:image/png;base64";
                    }
                }
            }
        }

        //重置response_body图片字段
        setBase64Property(options.response_body.data);
        //重置request_body图片字段
        setBase64Property(options.request_body);
        options.response_body = JSON.stringify(options.response_body);
        options.request_body = JSON.stringify(options.request_body);

        model.sys_log().then(sys_log => {
            sys_log.create(options);
        });
    }

    /**
     * 获取日志列表
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
        const sys_log = await model.sys_log();

        //验证条件
        var condition = new Sequelize.Options();
        condition.setWhere(options);
        condition.setOrder({
            request_time: "ASC"
        });
 

        var data = {};
        data.list = await sys_log.findAll(condition.getOptions());
        data.count = await sys_log.count(condition.getOptionsNoPage());

        retry.findOne(data, callback);
    }

    module.exports.writeLog = writeLog;
    module.exports.list = list;
})();