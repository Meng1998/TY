"use strict";

/**
 * 系统功能
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
            return conn.define("sys_role", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                role_name: {
                    field: "role_name",
                    type: that.Sequelize.STRING
                },
                dept_id: {
                    field: "dept_id",
                    type: that.Sequelize.STRING
                },
                dept_name: {
                    field: "dept_name",
                    type: that.Sequelize.STRING
                },
                workbench: {
                    field: "workbench",
                    type: that.Sequelize.STRING
                },
                order: {
                    field: "order",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "sys_role",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();