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

    var user = layui.sessionData("session").user;

    var message = layedit.build("message", {
        height: 200,
        tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink"]
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        $("[name='message']").val(layedit.getContent(message).replace(/\"/g, "'"));

        var noticeMsg = {
            ident: "CreateAddenda",
            param: [user.full_name, $("[name='project_name']").val()]
        }

        common.submitForm({
            url: {
                create: "/prj/addenda/create"
            }
        }, callback, noticeMsg);
    }

    //对外输出
    exports("main", {});
});