"use strict";

/**
 * 项目反馈方案
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
            return conn.define("prj_feedback_solution", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                feedback_id: {
                    field: "feedback_id",
                    type: that.Sequelize.STRING
                },
                feedback_title: {
                    field: "feedback_title",
                    type: that.Sequelize.STRING
                },
                feedback_message: {
                    field: "feedback_message",
                    type: that.Sequelize.TEXT
                },
                project_id: {
                    field: "project_id",
                    type: that.Sequelize.STRING
                },
                project_name: {
                    field: "project_name",
                    type: that.Sequelize.STRING
                },
                user_id: {
                    field: "user_id",
                    type: that.Sequelize.STRING
                },
                user_name: {
                    field: "user_name",
                    type: that.Sequelize.STRING
                },
                solution: {
                    field: "solution",
                    type: that.Sequelize.TEXT
                },
                update_time: {
                    field: "update_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                }
            }, {
                tableName: "prj_feedback_solution",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();