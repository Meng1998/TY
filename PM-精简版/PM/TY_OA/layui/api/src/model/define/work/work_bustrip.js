"use strict";

/**
 * 差旅管理
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
            return conn.define("work_bustrip", {
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
                start_time: {
                    field: "start_time",
                    type: that.Sequelize.DATE
                },
                end_time: {
                    field: "end_time",
                    type: that.Sequelize.DATE
                },
                type: {
                    field: "type",
                    type: that.Sequelize.STRING
                },
                project_id: {
                    field: "project_id",
                    type: that.Sequelize.STRING
                },
                project_name: {
                    field: "project_name",
                    type: that.Sequelize.STRING
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
                excues: {
                    field: "excues",
                    type: that.Sequelize.TEXT
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
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "work_bustrip",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();