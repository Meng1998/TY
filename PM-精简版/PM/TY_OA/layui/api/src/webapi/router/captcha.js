"use strict";

/**
 * 验证码
 */
(function () {

    const response = require("../../middleware/response");
    const tools = require("../../utils/tools");
    const svgCaptcha = require("svg-captcha");

    var captchaCacheArr = [];
    var timeout = 600000;

    /**
     * 获取验证码
     */
    const getCaptcha = {
        method: "post",
        routor: "/getCaptcha",
        describe: "获取验证码",
        callback: async function (req, res) {

            //客户端标识
            var ident = req.body.ident;

            captchaCacheArr.forEach(item => {
                if (item.ident === ident) {
                    captchaCacheArr.remove(item);
                    return true;
                }
            });

            const codeConfig = {
                size: 4, // 验证码长度
                ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
                noise: 2, // 干扰线条的数量
                width: 130,
                height: 36,
                fontSize: 45,
                color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
                background: '#eee',
            };
            const captcha = svgCaptcha.create(codeConfig);
            captchaCacheArr.push({
                code: captcha.text.toLowerCase(),
                ident: ident,
                generate: Date.now()
            }); // 存session用于验证接口获取文字码

            res.send(response.jsonData({
                success: true,
                data: {
                    img: captcha.data
                }
            }));
        }
    }

    /**
     * 获取验证码
     */
    const captchaCache = {
        method: "get",
        routor: "/captchaCache",
        /**
         * 清理缓存
         */
        clearcache: function () {
            captchaCacheArr.forEach(function (item) {
                if ((Date.now() - item.generate) > timeout) {
                    captchaCacheArr.remove(item);
                }
            });
        },
        /**
         * 验证验证码
         * @param {string} captcha 验证码
         * @param {string} ident 标识
         */
        verify: function (captcha, ident) {
            var verify = false;
            captchaCacheArr.forEach(item => {
                if (item.code === captcha.toLowerCase() && item.ident === ident) {
                    verify = true;
                    return verify;
                }
            });
            return verify;
        }
    }

    module.exports.getCaptcha = getCaptcha;
    module.exports.captchaCache = captchaCache;
    module.exports.description = "验证码操作";
})();