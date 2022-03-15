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
            return conn.define("prj_payment", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                contract_id: {
                    field: "contract_id",
                    type: that.Sequelize.STRING
                },
                term: {
                    field: "term",
                    type: that.Sequelize.STRING
                },
                amount: {
                    field: "amount",
                    type: that.Sequelize.NUMBER
                },
                invoice_status: {
                    field: "invoice_status",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return "0";
                    }
                },
                invoice_time: {
                    field: "invoice_time",
                    type: that.Sequelize.DATE
                },
                collect_status: {
                    field: "collect_status",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return "0";
                    }
                },
                collect_time: {
                    field: "collect_time",
                    type: that.Sequelize.DATE
                }
            }, {
                tableName: "prj_payment",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();