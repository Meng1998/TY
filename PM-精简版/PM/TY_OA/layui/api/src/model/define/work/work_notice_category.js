"use strict";

/**
 * 消息通知类别
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
            return conn.define("work_notice_category", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                category_name: {
                    field: "category_name",
                    type: that.Sequelize.STRING
                },
                order: {
                    field: "order",
                    type: that.Sequelize.NUMBER,
                    defaultValue: function () {
                        return 0;
                    }
                },
                types: {
                    field: "types",
                    type: that.Sequelize.TEXT
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "work_notice_category",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();