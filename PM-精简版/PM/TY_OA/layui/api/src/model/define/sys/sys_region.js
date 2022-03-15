"use strict";

/**
 * 行政区划
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
            return conn.define("sys_region", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING
                },
                name: {
                    field: "name",
                    type: that.Sequelize.STRING
                },
                pid: {
                    field: "pid",
                    type: that.Sequelize.STRING
                }
            }, {
                tableName: "sys_region",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();