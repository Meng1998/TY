"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], async function (exports) {

    var common = layui.common;
    var setter = layui.setter;
    var $ = layui.$;

    var user = layui.sessionData("session").user;

    $("[name='creater_id']").val(user.id);
    $("[name='creater_name']").val(user.full_name);

    //项目反馈类型
    var FeedbackType = await layui.base.dictionary(setter.dictionary.FeedbackType);
    FeedbackType.render({ elem: "[name='type']" });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        var noticeMsg = {
            ident: "CreateFeedback",
            param: [user.full_name, $("[name='project_name']").val()]
        }

        common.submitForm({
            url: {
                create: "/prj/feedback/create"
            }
        }, callback, noticeMsg);
    }

    //对外输出
    exports("main", {});
});