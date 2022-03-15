"use strict";

/**
 * MD5加密类
 */
(function () {
    const md5 = require("js-md5");

    module.exports = function (data) {
        return md5(data).toUpperCase();
    }
})();