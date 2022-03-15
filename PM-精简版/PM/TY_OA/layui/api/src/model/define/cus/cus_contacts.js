"use strict";

/**
 * 客户联系人
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
            return conn.define("cus_contacts", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                custom_id: {
                    field: "custom_id",
                    type: that.Sequelize.STRING
                },
                custom_name: {
                    field: "custom_name",
                    type: that.Sequelize.STRING
                },
                contacts_name: {
                    field: "contacts_name",
                    type: that.Sequelize.STRING
                },
                contacts_tel: {
                    field: "contacts_tel",
                    type: that.Sequelize.STRING
                },
                contacts_role: {
                    field: "contacts_role",
                    type: that.Sequelize.STRING
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "cus_contacts",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();