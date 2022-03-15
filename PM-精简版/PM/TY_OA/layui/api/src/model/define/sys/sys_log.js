"use strict";

/**
 * 系统操作日志
 */
(function () {

    var Base = require("../base");

    /**
     * @class
     * @public
     */
    class Model extends Base {
        constructor() {
            super();
        }

        /**
         * 定义模型
         */
        async define() {
            var that = this;
            const conn = await this.connection();
            return conn.define("sys_log", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                request_user: {
                    field: "request_user",
                    type: that.Sequelize.STRING
                },
                controller_name: {
                    field: "controller_name",
                    type: that.Sequelize.STRING
                },
                controller_routor: {
                    field: "controller_routor",
                    type: that.Sequelize.STRING
                },
                operation_type: {
                    field: "operation_type",
                    type: that.Sequelize.STRING
                },
                request_body: {
                    field: "request_body",
                    type: that.Sequelize.TEXT
                },
                response_body: {
                    field: "response_body",
                    type: that.Sequelize.TEXT
                },
                request_time: {
                    field: "request_time",
                    type: that.Sequelize.DATE
                },
                response_time: {
                    field: "response_time",
                    type: that.Sequelize.DATE
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "sys_log",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();