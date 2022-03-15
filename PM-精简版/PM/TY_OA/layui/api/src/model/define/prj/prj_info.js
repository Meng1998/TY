"use strict";

/**
 * 系统功能
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
            return conn.define("prj_info", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                project_code: {
                    field: "project_code",
                    type: that.Sequelize.STRING
                },
                project_name: {
                    field: "project_name",
                    type: that.Sequelize.STRING
                },
                project_type: {
                    field: "project_type",
                    type: that.Sequelize.STRING
                },
                important: {
                    field: "important",
                    type: that.Sequelize.NUMBER
                },
                geojson: {
                    field: "geojson",
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
                custom_id: {
                    field: "custom_id",
                    type: that.Sequelize.STRING
                },
                custom_name: {
                    field: "custom_name",
                    type: that.Sequelize.STRING
                },
                custom_address: {
                    field: "custom_address",
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
                project_status: {
                    field: "project_status",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return constant.project.follow;
                    }
                },
                follow_status: {
                    field: "follow_status",
                    type: that.Sequelize.STRING
                },
                creater_id: {
                    field: "creater_id",
                    type: that.Sequelize.STRING
                },
                creater_name: {
                    field: "creater_name",
                    type: that.Sequelize.STRING
                },
                create_time: {
                    field: "create_time",
                    type: that.Sequelize.DATE,
                    defaultValue: function () {
                        return Date.now();
                    }
                },
                responsible_id: {
                    field: "responsible_id",
                    type: that.Sequelize.STRING
                },
                responsible_name: {
                    field: "responsible_name",
                    type: that.Sequelize.STRING
                },
                person_id: {
                    field: "person_id",
                    type: that.Sequelize.STRING
                },
                person_name: {
                    field: "person_name",
                    type: that.Sequelize.STRING
                },
                emphasis: {
                    field: "emphasis",
                    type: that.Sequelize.NUMBER
                },
                contract_status: {
                    field: "contract_status",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return constant.contract.nosigned;
                    }
                },
                finished_date: {
                    field: "finished_date",
                    type: that.Sequelize.DATE
                },
                remark: {
                    field: "remark",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "prj_info",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();