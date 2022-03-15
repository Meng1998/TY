"use strict";

/**
 * 工作日志
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
            return conn.define("work_log", {
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
                date: {
                    field: "date",
                    type: that.Sequelize.DATE
                },
                content: {
                    field: "content",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "work_log",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();