!(function () {
    //获取路径
    var pathname = window.location.pathname;
    //页面主模块路径拼接
    var modules = pathname.replace("/client/view", "modules").replace(".html", "");
    // var modules = pathname.replace("/client/view", "modules").replace(".html", "");
    var basepath = "";
    switch (modules.split("/").length) {
        case 2:
            basepath = "../";
            break;
        case 3:
            basepath = "../../";
            break;
        case 4:
            basepath = "../../../";
            break;
    }

    var debug = false
    if (debug) {
        basepath = "http://127.0.0.1:5501/client/";
    }

    if (modules.endsWith("/")) {
        modules += "index";
    }

    var version = function () {
        var now = new Date();
        var date = {
            "M+": now.getMonth() + 1,
            "d+": now.getDate(),
            "h+": now.getHours(),
            "m+": now.getMinutes(),
            "s+": now.getSeconds(),
            "q+": Math.floor((now.getMonth() + 3) / 3),
            "S+": now.getMilliseconds()
        };
        var format = "yyyyMMddhhmm";
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };

    layui.config({
        base: basepath,
        version: version()
    }).extend({
        main: modules //主入口模块
    }).use("main");
})();