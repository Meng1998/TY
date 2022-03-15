"use strict";

/**
 * 许可授权
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
            return conn.define("lic_authorize", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                project_id: {
                    field: "project_id",
                    type: that.Sequelize.STRING
                },
                project_name: {
                    field: "project_name",
                    type: that.Sequelize.STRING
                },
                message: {
                    field: "message",
                    type: that.Sequelize.TEXT
                },
                machine_id: {
                    field: "machine_id",
                    type: that.Sequelize.STRING
                },
                creater_id: {
                    field: "creater_id",
                    type: that.Sequelize.STRING
                },
                creater_name: {
                    field: "creater_name",
                    type: that.Sequelize.STRING
                },
                authorizer_id: {
                    field: "authorizer_id",
                    type: that.Sequelize.STRING
                },
                authorizer_name: {
                    field: "authorizer_name",
                    type: that.Sequelize.STRING
                },
                authorize_status: {
                    field: "authorize_status",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return "0";
                    }
                },
                start_time: {
                    field: "start_time",
                    type: that.Sequelize.DATE
                },
                expire_time: {
                    field: "expire_time",
                    type: that.Sequelize.DATE
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                file_path: {
                    field: "file_path",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "lic_authorize",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();