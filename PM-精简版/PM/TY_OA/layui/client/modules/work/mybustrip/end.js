"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form", "laydate"], async function (exports) {

    var laydate = layui.laydate;
    var common = layui.common;
    var $ = layui.$;

    laydate.render({
        elem: "#end_time",
        position: "static",
        theme: "grid",
        showBottom: false,
        ready: function (date) {
            $("[name='end_time'").val(date.year + "-" + ((date.month.toString().length === 1) ? "0" + date.month : date.month) + "-" + ((date.date.toString().length === 1) ? "0" + date.date : date.date));
        },
        change: function (value, date) {
            $("[name='end_time'").val(value);
        }
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id"],
            url: {
                update: "/work/bustrip/update"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});