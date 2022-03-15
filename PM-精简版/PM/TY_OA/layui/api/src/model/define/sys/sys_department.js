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
            return conn.define("sys_department", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                dept_name: {
                    field: "dept_name",
                    type: that.Sequelize.STRING
                },
                dept_parent: {
                    field: "dept_parent",
                    type: that.Sequelize.STRING
                },
                leader_id: {
                    field: "leader_id",
                    type: that.Sequelize.STRING
                },
                leader_name: {
                    field: "leader_name",
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
                tableName: "sys_department",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();