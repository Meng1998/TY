"use strict";

/**
 * 功能需求
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
            return conn.define("prj_function", {
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
                message: {
                    field: "message",
                    type: that.Sequelize.TEXT
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                },
                status: {
                    field: "status",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                }
            }, {
                tableName: "prj_function",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();