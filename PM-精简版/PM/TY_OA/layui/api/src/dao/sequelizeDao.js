"use strict";

/**
 * 数据库操作
 */
(function () {
    const Sequelize = require("sequelize");
    const config = require("config");
    const tools = require("../utils/tools");

    /**
     * 初始化数据库连接
     * @function
     */
    function initDB() {

        //读取配置文件中的数据库连接属性
        const dbConfig = {
            username: config.get("database.username"),
            password: config.get("database.password"),
            host: config.get("database.host"),
            port: config.get("database.port"),
            dialect: config.get("database.dialect"),
            database: config.get("database.dbname")
        }

        //创建数据库连接
        const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            logging: false,
            timezone: '+08:00', //东八时区
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            query: {
                raw: true
            }
        });

        return new Promise((resolve, reject) => {
            sequelize.authenticate()
                .then(() => {
                    resolve(sequelize);
                }).catch(err => {
                    reject(err);
                });
        });
    }


    /**
     * 创建传入参数
     * @class
     * @public
     */
    class Options {
        constructor() {
            this.options = {
                where: new Object(),
                order: new Array(),
                attributes: new Array(),
                group: null
            };
            this.values = {};
        }

        /**
         * 设置where属性
         * @param {object} data 参数数据
         * @param {array} fields 字段名称
         */
        setWhere(data, fields) {
            if (tools.isNotEmpty(data) && tools.isNotEmpty(fields)) {
                for (var i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    if (data.hasOwnProperty(field)) {
                        this.options.where[field] = data[field];
                    }
                }
            } else {
                if (tools.isEmpty(fields)) {
                    var page = 0;
                    var limit = 0;
                    for (var p in data) {
                        if (p === "limit") { limit = data[p]; delete data[p]; }
                        if (p === "page") { page = data[p]; delete data[p]; }

                        if (tools.isEmpty(data[p])) {
                            delete data[p];
                        }
                    }
                    this.options.where = data;

                    if (limit === "1.7976931348623157e+308") {
                        this.options.limit = 1000000;
                    } else {
                        this.options.limit = parseInt(limit);
                    }
                    this.options.offset = (page - 1) * parseInt(limit);

                }
            }
        }

        /**
         * 设置attributes属性
         * @param {array} fields 字段名称
         */
        setAttributes(fields) {
            this.options.attributes = fields;
        }

        /**
         * 获取参数
         */
        getOptions() {
            if (this.options.attributes && this.options.attributes.length === 0) {
                delete this.options.attributes;
            }
            if (this.options.order && this.options.order.length === 0) {
                delete this.options.order;
            }
            if (tools.isEmpty(this.options.where)) {
                delete this.options.where;
            }
            if (tools.isEmpty(this.options.group)) {
                delete this.options.group;
            }
            if (this.options.limit === 0 && this.options.offset === -0) {
                delete this.options.limit;
                delete this.options.offset;
            }
            return this.options;
        }

        getOptionsNoPage() {
            if (this.options.attributes && this.options.attributes.length === 0) {
                delete this.options.attributes;
            }
            if (this.options.order && this.options.order.length === 0) {
                delete this.options.order;
            }
            if (tools.isEmpty(this.options.where)) {
                delete this.options.where;
            }
            if (tools.isEmpty(this.options.group)) {
                delete this.options.group;
            }

            var newOptions = tools.deepClone(this.options, ["limit", "offset"]);
            //某些特殊属性无法拷贝，例：[Sequelize.Op.like]
            newOptions.where = this.options.where;
            return newOptions
        }


        /**
         * 对象属性设置
         * @param {object} options 参数数据
         * @param {array} deleteFields 删除的字段
         */
        setValues(options, deleteFields) {
            this.values = options;
            if (tools.isNotEmpty(deleteFields)) {
                for (let i = 0; i < deleteFields.length; i++) {
                    const field = deleteFields[i];
                    delete this.values[field];
                }
            }
        }

        /**
         * 获取参数
         */
        getValues() {
            return this.values;
        }

        /**
         * 设置排序
         * @param {string} data 排序字段
         */
        setOrder(data) {
            for (var p in data) {
                this.options.order.push([p, data[p]]);
            }
        }

        /**
         * 设置分组
         * @param {string} field 分组字段
         */
        setGroup(field) {
            this.options.group = field;
        }
    }

    module.exports = Sequelize;
    module.exports.initDB = initDB;
    module.exports.Options = Options;
})();