"use script";

/**
 * 扩展notice方法
 */
layui.extend({
    notice: "lib/notice/notice"
}).define("notice", function (exports) {

    var notice = layui.notice;

    var type = {
        inf: "info",
        suc: "success",
        warn: "warning",
        err: "error",
        quest: "question"
    };

    for (var p in type) {
        (function (p) {
            notice[p] = function (options) {
                options.audio = layui.cache.base + "/client/assets/1";
                options.title = options.title ? options.title : "消息通知";
                options.timeout = options.timeout ? options.timeout : false;

                notice[type[p]](options);
            }
        })(p);
    }

    exports("noticeEx", layui.notice);
});