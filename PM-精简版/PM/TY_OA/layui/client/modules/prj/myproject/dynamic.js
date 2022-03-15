"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form", "layedit", "laydate"], function (exports) {

    var laydate = layui.laydate;
    var layedit = layui.layedit;
    var common = layui.common;
    var $ = layui.$;

    laydate.render({
        elem: "input[name='dynamic_time']",
    });

    var index = layedit.build("message", {
        height: 200,
        tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink"]
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        $("[name='message']").val(layedit.getContent(index).replace(/\"/g, "'"));

        var noticeMsg = {
            ident: "CreateDynamic",
            param: [$("[name='project_name']").val()]
        }

        common.submitForm({
            removeKeys: ["project_id", "project_name"],
            url: {
                create: "/prj/dynamic/create"
            }
        }, callback, noticeMsg);
    }

    //对外输出
    exports("main", {});
});