"use strict";

/**
 * 模型基类
 */
(function () {

    /**
     * @class
     * @public
     */
    class Base {
        constructor() {
            this.Sequelize = require("../../dao/sequelizeDao");
            this.tools = require("../../utils/tools");
            const { v1: uuidv1 } = require("uuid");
            this.uuidv1 = uuidv1;
        }

        /**
         * 创建数据库连接
         */
        async connection() {
            return await this.Sequelize.initDB();
        }

        /**
         * 获取UUID
         */
        uuid() {
            return this.uuidv1();
        }
    }

    module.exports = Base;

})();