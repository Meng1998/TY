"use script";

/**
 * Maintain服务相关
 * @author LYW
 */
(function () {

    const Sequelize = require("../dao/sequelizeDao");

    async function dbinfo() {
        const sequelize = await Sequelize.initDB();
        var max_connection = "show variables like '%max_connection%'";
        const data = await sequelize.query(max_connection, { type: sequelize.QueryTypes.SELECT });
        return {
        }
    }

    module.exports.dbinfo = dbinfo;
})();