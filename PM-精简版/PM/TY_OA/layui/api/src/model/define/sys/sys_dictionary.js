"use strict";

/**
 * 系统字典
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
            return conn.define("sys_dictionary", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                pid: {
                    field: "pid",
                    type: that.Sequelize.STRING
                },
                dic_name: {
                    field: "dic_name",
                    type: that.Sequelize.STRING
                },
                dic_identity: {
                    field: "dic_identity",
                    type: that.Sequelize.STRING
                },
                style: {
                    field: "style",
                    type: that.Sequelize.TEXT
                },
                op_value: {
                    field: "op_value",
                    type: that.Sequelize.TEXT
                },
                group: {
                    field: "group",
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
                tableName: "sys_dictionary",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();