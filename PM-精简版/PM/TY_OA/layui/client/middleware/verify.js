"use script";

/**
 * 表单验证
 */
layui.define(function (exports) {

    var util = layui.util;
    var $ = layui.$;

    var verify = {
        /**
         * 执行表单验证
         * @param {array} forms 表单集合
         */
        execute: function (formData) {
            for (var p in formData) {
                if (util.isEmpty(formData[p])) {
                    var selector = "[name='" + p + "']";
                    $(selector).focus();
                    var text = $(selector).attr("placeholder");
                    layer.tips("  " + text + "！  ", selector, {
                        tips: [1, '#009688'],
                        time: 2000
                    });
                    return false;
                } else {
                    var selector = "[name='" + p + "']";
                    var type = $(selector).attr("verify");
                    if (type) {
                        switch (type) {
                            case "number":
                                if (!isNumber(formData[p])) {
                                    $(selector).focus();
                                    layer.tips("  数字格式错误！  ", selector, {
                                        tips: [1, '#009688'],
                                        time: 2000
                                    });
                                    return false;
                                }
                                break;
                        }
                    }
                }
            }
            return true;
        }
    }

    function isNumber(value) {
        var n = Number(value);
        if (!isNaN(n)) {
            return true;
        }
        return false;
    }

    exports("verify", verify);
});
