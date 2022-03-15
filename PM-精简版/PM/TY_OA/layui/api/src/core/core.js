"use strict";

/**
 * 后台配置
 */
(function () {
    var extend = require("./extend");
    var timer = require("./timer");

    module.exports.init = function () {
        extend();
        timer();
    };
})();