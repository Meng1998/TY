"use strict";

/**
 * WebAPI相关
 * 创建API接口
 */
(function () {
    const colors = require("colors-console");
    const tools = require("../utils/tools");
    const date = require("../utils/date");

    const ctrl_sys_log = require("../controllers/sys/sys_log");
    const ctrl_work_notice = require("../controllers/work/work_notice");

    const config = require("config");
    const fs = require("fs");
    const path = require('path');
    const jwtutil = require("../utils/jwt");

    /**
     * 是否将所有操作都写入日志
     */
    const writelog = config.get("webapi.writelog");

    /**
     * 是否启用Token验证
     */
    const tokenEnable = config.get("token.enable");

    /**
     * 创建服务接口
     * @author LYW
     * @private
     * @function createAPI
     * @param {object} restify Restify服务
     * @param {object} websocket WebSocket服务
     * @param {object} routor 路由对象
     * @example
     * createAPI(restify, webapi);
     * createAPI(restify, websocket, openapi);
     */
    function createAPI(restify, websocket, routor) {

        console.log(colors("cyan", "--------------" + routor.description + "--------------"));

        //遍历路由
        for (var property in routor) {
            if (property === "description") {
                return;
            }
            /**
             * @description 此处使用闭包方式处理
             */
            (function (api) {

                //API对象
                if (tools.isEmpty(api)) {
                    api = websocket;
                    websocket = null;
                }

                if (tools.isNotEmpty(api.describe)) {
                    console.log("%s：%s", colors("white", api.describe), colors("yellow", api.routor));
                } else {
                    console.log("%s：%s", colors("red", "未知接口"), colors("yellow", api.routor));
                }

                restify[api.method](api.routor, function (req, res, next) {

                    /**
                     * Token验证
                     */
                    let token = req.headers.token;
                    if (token && tokenEnable) {
                        var public_key = fs.readFileSync(path.join(__dirname, '../pem/rsa_public_key.pem'));
                        req.headers.publickey = public_key;
                        let jwt = new jwtutil(req.headers);
                        let result = jwt.verifyToken();
                        if (!result) {
                            res.send({
                                code: 403,
                                msg: "Login Expired"
                            });
                            return next();
                        }
                    }

                    var notice = null;
                    if (req.body && req.body.notice) {
                        notice = req.body.notice;
                        delete req.body.notice;
                    }

                    //保存request
                    const request = req;

                    //获取数据库
                    if (tools.isEmpty(req.body) && api.method.toUpperCase() === "GET") {
                        req = res;
                    }

                    //所调用的接口
                    console.log("%s:%s", colors("cyan", date.now()), colors("yellow", api.routor));

                    api.callback(req, res).then(function (result) {

                        //是否发送消息
                        if (tools.isNotEmpty(api.msgsend) && tools.isNotEmpty(websocket)) {
                            //发送消息
                            if (api.ident) {
                                websocket.notice(api.ident, res._body);
                            }
                        }

                        //判断是否需要写入日志
                        if (api.writelog || writelog) {
                            if (tools.isEmpty(req.body) && api.method.toUpperCase() === "GET") {
                                //get，请求参数为空
                                writeLog(request, res, api);
                            } else {
                                //post
                                writeLog(req, res, api);
                            }
                        }

                        if (notice) {
                            writeNotice(notice, res, websocket);
                        }
                    });
                    return next();
                });
            })(routor[property]);
        }
    }

    /**
     * 写入日志
     * @param {request} req 请求对象
     * @param {response} res 响应对象
     * @param {object} api 调用的api
     */
    function writeLog(req, res, api) {

        /**
         * 日志信息
         */
        var logInfo = {
            controller_name: api.describe,      //接口名称
            controller_routor: api.routor,      //接口对象
            operation_type: tools.isEmpty(api.operation) ? 0 : api.operation,
            request_user: req.headers.user,
            request_time: req.date(),
            request_body: req.body,
            response_time: new Date(),
            response_body: res._body,
            remark: ""
        }

        //登录单独处理
        if (api.routor === sys_user.login.routor && logInfo.response_body.code === 0) {
            logInfo.request_user = logInfo.response_body.data.full_name;
        } else {
            return;
        }

        ctrl_sys_log.writeLog(logInfo);
    }

    /**
     * 写入消息
     * @param {object} notice 消息信息
     * @param {object} websocket WebSocket服务
     */
    async function writeNotice(notice, res, websocket) {
        var type = await ctrl_work_notice.create(notice, res._body);
        websocket.notice("notice." + type);
    }

    /*****************************authorize 权鉴机制*****************************/
    const authorize = require("./router/authorize");
    /*****************************captcha 验证码操作*****************************/
    const captcha = require("./router/captcha");
    /*****************************geoatlas 验证码操作*****************************/
    const geoatlas = require("./router/geoatlas");
    /*****************************dingtalk 钉钉开放平台*****************************/
    const dingtalk = require("./router/dingtalk");
    /*****************************sys_user 系统用户*****************************/
    const sys_user = require("./router/sys/sys_user");
    /*****************************sys_user 系统用户*****************************/
    const sys_action = require("./router/sys/sys_action");
    /*****************************sys_department 系统部门*****************************/
    const sys_department = require("./router/sys/sys_department");
    /*****************************sys_region 系统部门*****************************/
    const sys_region = require("./router/sys/sys_region");
    /*****************************sys_role 系统角色*****************************/
    const sys_role = require("./router/sys/sys_role");
    /*****************************sys_role 角色功能*****************************/
    const sys_role_action = require("./router/sys/sys_role_action");
    /*****************************sys_role 系统字典*****************************/
    const sys_dictionary = require("./router/sys/sys_dictionary");
    /*****************************cus_info 客户信息*****************************/
    const cus_info = require("./router/cus/cus_info");
    /*****************************cus_contacts 客户联系人*****************************/
    const cus_contacts = require("./router/cus/cus_contacts");
    /*****************************lic_authorize 许可授权*****************************/
    const lic_authorize = require("./router/lic/lic_authorize");
    /*****************************lic_project 授权项目*****************************/
    const lic_project = require("./router/lic/lic_project");
    /*****************************prj_info 项目信息*****************************/
    const prj_info = require("./router/prj/prj_info");
    /*****************************prj_responsible 项目负责人*****************************/
    const prj_responsible = require("./router/prj/prj_responsible");
    /*****************************prj_addenda 项目补充*****************************/
    const prj_addenda = require("./router/prj/prj_addenda");
    /*****************************prj_function 功能需求*****************************/
    const prj_function = require("./router/prj/prj_function");
    /*****************************prj_feedback 项目反馈*****************************/
    const prj_feedback = require("./router/prj/prj_feedback");
    /*****************************prj_feedback_solution 项目反馈方案*****************************/
    const prj_feedback_solution = require("./router/prj/prj_feedback_solution");
    /*****************************prj_dynamic 项目动态*****************************/
    const prj_dynamic = require("./router/prj/prj_dynamic");
    /*****************************prj_transfer 项目移交*****************************/
    const prj_transfer = require("./router/prj/prj_transfer");
    /*****************************prj_contract 项目合同*****************************/
    const prj_contract = require("./router/prj/prj_contract");
    /*****************************prj_payment 合同付款*****************************/
    const prj_payment = require("./router/prj/prj_payment");
    /*****************************prj_files 合同付件*****************************/
    const prj_files = require("./router/prj/prj_files");
    /*****************************work_leave 请假管理*****************************/
    const work_leave = require("./router/work/work_leave");
    /*****************************work_bustrip 差旅管理*****************************/
    const work_bustrip = require("./router/work/work_bustrip");
    /*****************************work_log 工作日志*****************************/
    const work_log = require("./router/work/work_log");
    /*****************************work_notice 消息通知*****************************/
    const work_notice = require("./router/work/work_notice");
    /*****************************work_notice_user 消息通知人员配置*****************************/
    const work_notice_user = require("./router/work/work_notice_user");
    /*****************************work_notice_config 消息通知类型*****************************/
    const work_notice_config = require("./router/work/work_notice_config");
    /*****************************work_notice_category 消息通知类别*****************************/
    const work_notice_category = require("./router/work/work_notice_category");
    /*****************************mgr_project 项目管理*****************************/
    const mgr_project = require("./router/mgr/mgr_project");
    /*****************************mgr_personnel 人员管理*****************************/
    const mgr_personnel = require("./router/mgr/mgr_personnel");

    module.exports = function (restify, websocket) {

        createAPI(restify, websocket, authorize);
        createAPI(restify, websocket, captcha);
        createAPI(restify, websocket, geoatlas);
        createAPI(restify, websocket, dingtalk);

        createAPI(restify, websocket, sys_user);
        createAPI(restify, websocket, sys_action);
        createAPI(restify, websocket, sys_department);
        createAPI(restify, websocket, sys_region);
        createAPI(restify, websocket, sys_role);
        createAPI(restify, websocket, sys_dictionary);
        createAPI(restify, websocket, sys_role_action);
        createAPI(restify, websocket, cus_info);
        createAPI(restify, websocket, cus_contacts);

        createAPI(restify, websocket, lic_authorize);
        createAPI(restify, websocket, lic_project);

        createAPI(restify, websocket, prj_info);
        createAPI(restify, websocket, prj_responsible);
        createAPI(restify, websocket, prj_addenda);
        createAPI(restify, websocket, prj_function);
        createAPI(restify, websocket, prj_contract);
        createAPI(restify, websocket, prj_feedback);
        createAPI(restify, websocket, prj_feedback_solution);
        createAPI(restify, websocket, prj_dynamic);
        createAPI(restify, websocket, prj_transfer);
        createAPI(restify, websocket, prj_payment);
        createAPI(restify, websocket, prj_files);

        createAPI(restify, websocket, work_leave);
        createAPI(restify, websocket, work_bustrip);
        createAPI(restify, websocket, work_log);
        createAPI(restify, websocket, work_notice_category);
        createAPI(restify, websocket, work_notice_config);
        createAPI(restify, websocket, work_notice_user);
        createAPI(restify, websocket, work_notice);

        createAPI(restify, websocket, mgr_project);
        createAPI(restify, websocket, mgr_personnel);

        console.log("MapVision_V5 WebAPI接口：%s", colors("green", "发布成功"));
    }
})();