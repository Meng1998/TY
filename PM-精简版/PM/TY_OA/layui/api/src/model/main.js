"use strict";

/**
 * 模型配置
 */
(function () {

    const path = require("path");

    /**
     * 模型定义属性
     * @constant
     */
    const config = [
        { name: "sys_action", prototype: "sys_action", path: "./define/sys/sys_action.js" },
        { name: "sys_department", prototype: "sys_department", path: "./define/sys/sys_department.js" },
        { name: "sys_role", prototype: "sys_role", path: "./define/sys/sys_role.js" },
        { name: "sys_role_action", prototype: "sys_role_action", path: "./define/sys/sys_role_action.js" },
        { name: "sys_log", prototype: "sys_log", path: "./define/sys/sys_log.js" },
        { name: "sys_region", prototype: "sys_region", path: "./define/sys/sys_region.js" },
        { name: "sys_user", prototype: "sys_user", path: "./define/sys/sys_user.js" },
        { name: "sys_dictionary", prototype: "sys_dictionary", path: "./define/sys/sys_dictionary.js" },

        { name: "lic_authorize", prototype: "lic_authorize", path: "./define/lic/lic_authorize.js" },
        { name: "lic_project", prototype: "lic_project", path: "./define/lic/lic_project.js" },

        { name: "prj_function", prototype: "prj_function", path: "./define/prj/prj_function.js" },
        { name: "prj_addenda", prototype: "prj_addenda", path: "./define/prj/prj_addenda.js" },
        { name: "prj_feedback", prototype: "prj_feedback", path: "./define/prj/prj_feedback.js" },
        { name: "prj_feedback_solution", prototype: "prj_feedback_solution", path: "./define/prj/prj_feedback_solution.js" },
        { name: "prj_dynamic", prototype: "prj_dynamic", path: "./define/prj/prj_dynamic.js" },
        { name: "prj_info", prototype: "prj_info", path: "./define/prj/prj_info.js" },
        { name: "prj_responsible", prototype: "prj_responsible", path: "./define/prj/prj_responsible.js" },
        { name: "prj_transfer", prototype: "prj_transfer", path: "./define/prj/prj_transfer.js" },
        { name: "prj_contract", prototype: "prj_contract", path: "./define/prj/prj_contract.js" },
        { name: "prj_payment", prototype: "prj_payment", path: "./define/prj/prj_payment.js" },
        { name: "prj_files", prototype: "prj_files", path: "./define/prj/prj_files.js" },

        { name: "cus_info", prototype: "cus_info", path: "./define/cus/cus_info.js" },
        { name: "cus_contacts", prototype: "cus_contacts", path: "./define/cus/cus_contacts.js" },

        { name: "work_bustrip", prototype: "work_bustrip", path: "./define/work/work_bustrip.js" },
        { name: "work_leave", prototype: "work_leave", path: "./define/work/work_leave.js" },
        { name: "work_log", prototype: "work_log", path: "./define/work/work_log.js" },
        { name: "work_notice", prototype: "work_notice", path: "./define/work/work_notice.js" },
        { name: "work_notice_category", prototype: "work_notice_category", path: "./define/work/work_notice_category.js" },
        { name: "work_notice_config", prototype: "work_notice_config", path: "./define/work/work_notice_config.js" },
        { name: "work_notice_user", prototype: "work_notice_user", path: "./define/work/work_notice_user.js" }

    ];


    /**
     * 模型对象类
     * @class
     * @private
     */
    function Model() {
        /**
         * TODO
         */
    }

    /**
     * 创建模型
     * @param {string} model_name 模型名称 
     */
    const createModel = function (model_name) {
        //遍历模型属性数据
        config.forEach(item => {
            if (model_name === item.name) {
                //添加定义
                Model.prototype[item.prototype] = async function () {
                    switch (model_name) {
                        case "sys_user":
                            return await require("./define/sys/sys_user").define();
                        case "sys_department":
                            return await require("./define/sys/sys_department").define();
                        case "sys_role":
                            return await require("./define/sys/sys_role").define();
                        case "sys_action":
                            return await require("./define/sys/sys_action").define();
                        case "sys_role_action":
                            return await require("./define/sys/sys_role_action").define();
                        case "sys_log":
                            return await require("./define/sys/sys_log").define();
                        case "sys_region":
                            return await require("./define/sys/sys_region").define();
                        case "sys_dictionary":
                            return await require("./define/sys/sys_dictionary").define();
                        case "lic_authorize":
                            return await require("./define/lic/lic_authorize").define();
                        case "lic_project":
                            return await require("./define/lic/lic_project").define();
                        case "prj_info":
                            return await require("./define/prj/prj_info").define();
                        case "prj_responsible":
                            return await require("./define/prj/prj_responsible").define();
                        case "prj_transfer":
                            return await require("./define/prj/prj_transfer").define();
                        case "prj_addenda":
                            return await require("./define/prj/prj_addenda").define();
                        case "prj_function":
                            return await require("./define/prj/prj_function").define();
                        case "prj_dynamic":
                            return await require("./define/prj/prj_dynamic").define();
                        case "prj_feedback":
                            return await require("./define/prj/prj_feedback").define();
                        case "prj_feedback_solution":
                            return await require("./define/prj/prj_feedback_solution").define();
                        case "prj_contract":
                            return await require("./define/prj/prj_contract").define();
                        case "prj_payment":
                            return await require("./define/prj/prj_payment").define();
                        case "prj_files":
                            return await require("./define/prj/prj_files").define();

                        case "cus_info":
                            return await require("./define/cus/cus_info").define();
                        case "cus_contacts":
                            return await require("./define/cus/cus_contacts").define();

                        case "work_bustrip":
                            return await require("./define/work/work_bustrip").define();
                        case "work_leave":
                            return await require("./define/work/work_leave").define();
                        case "work_log":
                            return await require("./define/work/work_log").define();
                        case "work_notice":
                            return await require("./define/work/work_notice").define();
                        case "work_notice_category":
                            return await require("./define/work/work_notice_category").define();
                        case "work_notice_config":
                            return await require("./define/work/work_notice_config").define();
                        case "work_notice_user":
                            return await require("./define/work/work_notice_user").define();
                    }
                }
            }
        });
    }

    /**
     * 根据传入模型名称定义模型
     * @module
     */
    module.exports = function () {
        if (arguments.length === 0) {
            return;
        }
        for (var i = 0; i < arguments.length; i++) {
            var model_name = arguments[i];
            if (model_name === " ") {
                var aa = "";
            }
            createModel(model_name);
        }
        return new Model();
    }
})();