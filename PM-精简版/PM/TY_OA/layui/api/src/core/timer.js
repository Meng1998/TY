"use strict";

/**
 * 验证码
 */
(function () {

    const captcha = require("../webapi/router/captcha");
    var CronJob = require('cron').CronJob;

    module.exports = function () {
        new CronJob('*/10 * * * * *', function () {
            //清理缓存验证码
            captcha.captchaCache.clearcache();
        }, null, true);
    };
})();