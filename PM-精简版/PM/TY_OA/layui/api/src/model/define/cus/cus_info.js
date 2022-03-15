"use strict";

/**
 * 客户信息
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
            return conn.define("cus_info", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                custom_name: {
                    field: "custom_name",
                    type: that.Sequelize.STRING
                },
                custom_address: {
                    field: "custom_address",
                    type: that.Sequelize.STRING
                },
                province: {
                    field: "province",
                    type: that.Sequelize.STRING
                },
                province_name: {
                    field: "province_name",
                    type: that.Sequelize.STRING
                },
                city: {
                    field: "city",
                    type: that.Sequelize.STRING
                },
                city_name: {
                    field: "city_name",
                    type: that.Sequelize.STRING
                },
                county: {
                    field: "county",
                    type: that.Sequelize.STRING
                },
                county_name: {
                    field: "county_name",
                    type: that.Sequelize.STRING
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "cus_info",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();