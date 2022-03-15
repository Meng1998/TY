"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form", "layedit"], async function (exports) {

    var layedit = layui.layedit;
    var common = layui.common;
    var $ = layui.$;
    var tool = ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink"];
    var message = layedit.build("message", {
        height: 200,
        tool: tool
    });
    var remark = layedit.build("remark", {
        height: 150,
        tool: tool
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        $("[name='message']").val(layedit.getContent(message).replace(/\"/g,"'"));
        $("[name='remark']").val(layedit.getContent(remark).replace(/\"/g,"'"));

        common.submitForm({
            removeKeys: ["remark"],
            url: {
                create: "/prj/function/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});