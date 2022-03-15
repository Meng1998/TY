"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form", "layedit"], async function (exports) {

    var layedit = layui.layedit;
    var form = layui.form;
    var request = layui.request;
    var common = layui.common;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    var content;

    request.post({
        url: "/work/log",
        data: form.val(LAY_FORM),
        success: function (data) {
            form.val(LAY_FORM, data);
        },
        complete: function () {
            content = layedit.build("content", {
                height: 426,
                tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink"]
            });
        }
    })

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        $("[name='content']").val(layedit.getContent(content).replace(/\"/g, "'"));
        common.submitForm({
            removeKeys: ["id", "content"],
            url: {
                update: "/work/log/update",
                create: "/work/log/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});