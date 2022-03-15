"use strict";

/**
 * 功能角色关联
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
            return conn.define("sys_role_action", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                role_id: {
                    field: "role_id",
                    type: that.Sequelize.STRING
                },
                action_id: {
                    field: "action_id",
                    type: that.Sequelize.STRING
                }
            }, {
                tableName: "sys_role_action",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();