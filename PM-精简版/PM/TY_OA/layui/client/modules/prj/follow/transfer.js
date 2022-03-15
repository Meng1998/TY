"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], async function (exports) {

    var request = layui.request;
    var common = layui.common;
    var form = layui.form;
    var $ = layui.$;

    var LAY_RECEIVER_NAME = "LAY-receiver-name";

    request.post({
        url: "/prj/responsible/list",
        success: function (data) {
            for (let i = 0; i < data.list.length; i++) {
                const item = data.list[i];
                $("[name='receiver_id']").append("<option value='" + item.user_id + "'>" + item.full_name + "</option>");
            }

            form.render();
        }
    });

    form.on("select(" + LAY_RECEIVER_NAME + ")", function (data) {
        $("[name='receiver_name']").val(data.elem[data.elem.selectedIndex].text);
    });

    window.submit = function (callback) {

        var noticeMsg = {
            ident: "UpdateProjectResponsible",
            param: [$("[name='project_name']").val(), $("[name='receiver_name']").val()]
        }

        common.submitForm({
            msg: "项目移交成功",
            url: {
                create: "/prj/transfer/create"
            }
        }, callback, noticeMsg);
    }

    //对外输出
    exports("main", {});
});