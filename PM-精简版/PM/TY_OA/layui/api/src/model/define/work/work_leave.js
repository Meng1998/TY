"use strict";

/**
 * 请假管理
 */
(function () {

    var Base = require("../base");

    var constant = require("../../../middleware/constant");

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
            return conn.define("work_leave", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                user_id: {
                    field: "user_id",
                    type: that.Sequelize.STRING
                },
                user_name: {
                    field: "user_name",
                    type: that.Sequelize.STRING
                },
                start_time: {
                    field: "start_time",
                    type: that.Sequelize.DATE
                },
                end_time: {
                    field: "end_time",
                    type: that.Sequelize.DATE
                },
                excues: {
                    field: "excues",
                    type: that.Sequelize.TEXT
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                type: {
                    field: "type",
                    type: that.Sequelize.STRING
                },
                approval: {
                    field: "approval",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        //默认状态：已提交
                        return constant.approval.submit;
                    }
                },
                approver_id: {
                    field: "approver_id",
                    type: that.Sequelize.STRING
                },
                approver_name: {
                    field: "approver_name",
                    type: that.Sequelize.STRING
                }
            }, {
                tableName: "work_leave",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();