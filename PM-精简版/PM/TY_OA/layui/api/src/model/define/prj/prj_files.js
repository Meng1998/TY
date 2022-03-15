"use strict";

/**
 * 合同附件
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
            return conn.define("prj_files", {
                id: {
                    field: "id",
                    primaryKey: true,
                    type: that.Sequelize.STRING,
                    defaultValue: function () {
                        return that.uuid();
                    }
                },
                contract_id: {
                    field: "contract_id",
                    type: that.Sequelize.STRING
                },
                file_name: {
                    field: "file_name",
                    type: that.Sequelize.STRING
                },
                file_path: {
                    field: "file_path",
                    type: that.Sequelize.TEXT
                }
            }, {
                tableName: "prj_files",
                timestamps: false
            });
        }
    }

    module.exports.define = function () {
        return new Model().define();
    }

})();