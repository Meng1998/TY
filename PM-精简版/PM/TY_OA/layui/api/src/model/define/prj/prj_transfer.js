"use strict";

/**
 * 项目移交
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
            return conn.define("prj_transfer", {
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
                transfer_time: {
                    field: "transfer_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                transferor_id: {
                    field: "transferor_id",
                    type: that.Sequelize.STRING
                },
                transferor_name: {
                    field: "transferor_name",
                    type: that.Sequelize.STRING
                },
                receiver_id: {
                    field: "receiver_id",
                    type: that.Sequelize.STRING
                },
                receiver_name: {
                    field: "receiver_name",
                    type: that.Sequelize.STRING
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "prj_transfer",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();