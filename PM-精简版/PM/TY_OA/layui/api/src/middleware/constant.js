"use strict";

/**
 * 字典类
 */
(function () {

    const constant = {
        leave: {
            matter: "1",    //事假
            sick: "2",      //病假
            marry: "3"      //婚假
        },
        approval: {
            submit: "0",        //已提交
            approved: "1",      //已批准
            unapproved: "2",    //未批准
        },
        project: {
            follow: "1",        //跟进项目
            conduct: "2"        //进行项目
        },
        contract: {
            nosigned: "0",      //未签
            signed: "1"         //已签
        },
        follow: {
            budget: "1",        //预算
            tender: "2",        //投标
            winbid: "3"         //中标
        }
    }

    module.exports.leave = constant.leave;
    module.exports.approval = constant.approval;
    module.exports.project = constant.project;
    module.exports.contract = constant.contract;
})();