"use strict";

/**
 * 消息通知类型
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
            return conn.define("work_notice_config", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                category_id: {
                    field: "category_id",
                    type: that.Sequelize.STRING
                },
                ident: {
                    field: "ident",
                    type: that.Sequelize.STRING
                },
                controller_name: {
                    field: "controller_name",
                    type: that.Sequelize.STRING
                },
                controller_routor: {
                    field: "controller_routor",
                    type: that.Sequelize.STRING
                },
                type: {
                    field: "type",
                    type: that.Sequelize.STRING
                },
                title: {
                    field: "title",
                    type: that.Sequelize.STRING
                },
                describe: {
                    field: "describe",
                    type: that.Sequelize.STRING
                },
                params_type: {
                    field: "params_type",
                    type: that.Sequelize.STRING
                },
                storage: {
                    field: "storage",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
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
                tableName: "work_notice_config",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();