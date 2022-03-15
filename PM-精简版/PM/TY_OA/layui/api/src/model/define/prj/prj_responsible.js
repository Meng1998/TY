"use strict";

/**
 * 项目负责人
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
            return conn.define("prj_responsible", {
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
                full_name: {
                    field: "full_name",
                    type: that.Sequelize.STRING
                }
            }, {
                tableName: "prj_responsible",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();