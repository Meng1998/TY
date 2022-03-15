"use strict";

/**
 * 系统用户
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
            return conn.define("sys_user", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                user_name: {
                    field: "user_name",
                    type: that.Sequelize.STRING
                },
                user_pwd: {
                    field: "user_pwd",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return "123456";
                    }
                },
                full_name: {
                    field: "full_name",
                    type: that.Sequelize.STRING
                },
                head_img: {
                    field: "head_img",
                    type: that.Sequelize.TEXT
                },
                dept_id: {
                    field: "dept_id",
                    type: that.Sequelize.STRING
                },
                dept_name: {
                    field: "dept_name",
                    type: that.Sequelize.STRING
                },
                role_id: {
                    field: "role_id",
                    type: that.Sequelize.STRING
                },
                role_name: {
                    field: "role_name",
                    type: that.Sequelize.STRING
                },
                entry_time: {
                    field: "entry_time",
                    type: that.Sequelize.DATE
                },
                user_tel: {
                    field: "user_tel",
                    type: that.Sequelize.STRING
                },
                contract_sign: {
                    field: "contract_sign",
                    type: that.Sequelize.DATE
                },
                contract_expire: {
                    field: "contract_expire",
                    type: that.Sequelize.DATE
                },
                emergency_contacts: {
                    field: "emergency_contacts",
                    type: that.Sequelize.STRING
                },
                emergency_tel: {
                    field: "emergency_tel",
                    type: that.Sequelize.STRING
                },
                bank: {
                    field: "bank",
                    type: that.Sequelize.STRING
                },
                bankcard: {
                    field: "bankcard",
                    type: that.Sequelize.STRING
                },
                wages: {
                    field: "wages",
                    type: that.Sequelize.NUMBER
                },
                user_email: {
                    field: "user_email",
                    type: that.Sequelize.STRING
                },
                user_qq: {
                    field: "user_qq",
                    type: that.Sequelize.STRING
                },
                user_wechat: {
                    field: "user_wechat",
                    type: that.Sequelize.STRING
                },
                identity_card: {
                    field: "identity_card",
                    type: that.Sequelize.STRING
                },
                birthday: {
                    field: "birthday",
                    type: that.Sequelize.STRING
                },
                university: {
                    field: "university",
                    type: that.Sequelize.STRING
                },
                speciality: {
                    field: "speciality",
                    type: that.Sequelize.STRING
                },
                education: {
                    field: "education",
                    type: that.Sequelize.STRING
                },
                native_place: {
                    field: "native_place",
                    type: that.Sequelize.STRING
                },
                person_status: {
                    field: "person_status",
                    type: that.Sequelize.STRING
                },
                location: {
                    field: "location",
                    type: that.Sequelize.STRING
                },
                job_status: {
                    field: "job_status",
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return "1";//在职
                    }
                },
                ding_userid: {
                    field: "ding_userid",
                    type: that.Sequelize.STRING
                },
                ding_attendance: {
                    field: "ding_attendance",
                    type: that.Sequelize.NUMBER
                }
            }, {
                tableName: "sys_user",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();