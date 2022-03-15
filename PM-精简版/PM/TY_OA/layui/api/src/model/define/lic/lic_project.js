"use strict";

/**
 * 授权项目
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
            return conn.define("lic_project", {
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
                project_code: {
                    field: "project_code",
                    type: that.Sequelize.STRING
                },
                project_name: {
                    field: "project_name",
                    type: that.Sequelize.STRING
                },
                expire_time: {
                    field: "expire_time",
                    type: that.Sequelize.DATE
                }
            }, {
                tableName: "lic_project",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();