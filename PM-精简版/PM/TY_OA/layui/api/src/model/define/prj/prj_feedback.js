"use strict";

/**
 * 问题反馈
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
            return conn.define("prj_feedback", {
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
                title: {
                    field: "title",
                    type: that.Sequelize.STRING
                },
                type: {
                    field: "type",
                    type: that.Sequelize.STRING
                },
                message: {
                    field: "message",
                    type: that.Sequelize.TEXT
                },
                important: {
                    field: "important",
                    type: that.Sequelize.NUMBER
                },
                solution: {
                    field: "solution",
                    type: that.Sequelize.TEXT
                },
                distrib: {
                    field: "distrib",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                },
                status: {
                    field: "status",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                },
                reject_reason: {
                    field: "reject_reason",
                    type: that.Sequelize.TEXT
                },
                creater_id: {
                    field: "creater_id",
                    type: that.Sequelize.STRING
                },
                creater_name: {
                    field: "creater_name",
                    type: that.Sequelize.STRING
                },
                designee_id: {
                    field: "designee_id",
                    type: that.Sequelize.STRING
                },
                designee_name: {
                    field: "designee_name",
                    type: that.Sequelize.STRING
                },
                assignor_id: {
                    field: "assignor_id",
                    type: that.Sequelize.STRING
                },
                assignor_name: {
                    field: "assignor_name",
                    type: that.Sequelize.STRING
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                estimate_time: {
                    field: "estimate_time",
                    type: that.Sequelize.DATE
                },
                finished_time: {
                    field: "finished_time",
                    type: that.Sequelize.DATE
                },
                identified: {
                    field: "identified",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                }
            }, {
                tableName: "prj_feedback",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();