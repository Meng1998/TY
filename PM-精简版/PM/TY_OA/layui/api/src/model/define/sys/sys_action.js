"use strict";

/**
 * 系统功能
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
            return conn.define("sys_action", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                action_name: {
                    field: "action_name",
                    type: that.Sequelize.STRING
                },
                action_title: {
                    field: "action_title",
                    type: that.Sequelize.STRING
                },
                action_intent: {
                    field: "action_intent",
                    type: that.Sequelize.STRING
                },
                action_icon: {
                    field: "action_icon",
                    type: that.Sequelize.STRING
                },
                action_parent: {
                    field: "action_parent",
                    type: that.Sequelize.STRING
                },
                action_enable: {
                    field: "action_enable",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return "1";
                    }
                },
                order: {
                    field: "order",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                },
                ident: {
                    field: "ident",
                    type: that.Sequelize.STRING
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "sys_action",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();