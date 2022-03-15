"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], async function (exports) {

    var setter = layui.setter;
    var common = layui.common;
    var form = layui.form;
    var request = layui.request;
    var $ = layui.$;

    var user = layui.sessionData("session").user;

    var LAY_FORM = "LAY-form";

    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    for (let i = 0; i < FollowStatus.list.length; i++) {
        const dic = FollowStatus.list[i];
        $("#follow").append("<input type='radio' name='follow_status' lay-filter='follow_status' value='" + dic.op_value + "' title='" + dic.dic_name + "'>");
    }

    form.render();

    request.post({
        url: "/prj/info",
        data: { id: $("[name='id']").val() },
        success: function (data) {
            form.val(LAY_FORM, data);
        }
    });

    form.on('radio(follow_status)', function (data) {

        var projectData = form.val(LAY_FORM);

        //拼接消息通知
        var noticeMsg = {
            ident: "UpdateProjectFollowStatus",
            param: [projectData.project_name, FollowStatus.Formatter(projectData.follow_status)]
        }
        var data = projectData;
        data.notice = noticeMsg;
        data.notice.user_id = user.id;
        data.notice.user_name = user.full_name;
        data.notice.data = JSON.stringify(projectData);

        request.post({
            url: "/prj/info/update",
            data: data,
            success: function (result) {
                parentLayer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //对外输出
    exports("main", {});
});