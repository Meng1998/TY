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

    var LAY_FORM = "LAY-form";

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/prj/feedback",
            data: { id: id },
            success: function (data) {
                form.val(LAY_FORM, data);
            }
        });
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        var update = ($("[name='type']").val() === "user") ? "/prj/feedback_solution/update" : "/prj/feedback/update";
        var noticeMsg = null;
        if ($("[name='type']").val() !== "user") {
            noticeMsg = { ident: "UpdateFeedbackSolution" };
        }

        if ($("[name='type']").val() === "confirm") {
            $("[name='distrib']").val("1");
        }

        common.submitForm({
            url: {
                update: update
            }
        }, callback, noticeMsg);
    }

    //对外输出
    exports("main", {});
});