"use strict";

/**
 * 消息通知
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
            return conn.define("work_notice", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                batch: {
                    field: "batch",
                    type: that.Sequelize.STRING
                },
                ident: {
                    field: "ident",
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
                message: {
                    field: "message",
                    type: that.Sequelize.TEXT
                },
                params: {
                    field: "params",
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
                receiver_id: {
                    field: "receiver_id",
                    type: that.Sequelize.STRING
                },
                receiver_name: {
                    field: "receiver_name",
                    type: that.Sequelize.STRING
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                read_status: {
                    field: "read_status",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                }
            }, {
                tableName: "work_notice",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();