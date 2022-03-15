"use strict";

/**
 * 项目合同
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
            return conn.define("prj_contract", {
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
                custom_id: {
                    field: "custom_id",
                    type: that.Sequelize.STRING
                },
                custom_name: {
                    field: "custom_name",
                    type: that.Sequelize.STRING
                },
                sign_time: {
                    field: "sign_time",
                    type: that.Sequelize.DATE
                },
                amount: {
                    field: "amount",
                    type: that.Sequelize.NUMBER
                }, 
                receivable: {
                    field: "receivable",
                    type: that.Sequelize.NUMBER
                },
                paid: {
                    field: "paid",
                    type: that.Sequelize.NUMBER
                },
                delivery_time: {
                    field: "delivery_time",
                    type: that.Sequelize.DATE
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "prj_contract",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();