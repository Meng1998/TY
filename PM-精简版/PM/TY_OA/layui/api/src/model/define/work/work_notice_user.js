"use strict";

/**
 * 消息通知人员配置
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
            return conn.define("work_notice_user", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                notice_id: {
                    field: "notice_id",
                    type: that.Sequelize.STRING
                },
                notice_title: {
                    field: "notice_title",
                    type: that.Sequelize.STRING
                },
                ident: {
                    field: "ident",
                    type: that.Sequelize.STRING
                },
                role_id: {
                    field: "role_id",
                    type: that.Sequelize.STRING
                },
                user_role: {
                    field: "user_role",
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
                head_img: {
                    field: "head_img",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "work_notice_user",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();