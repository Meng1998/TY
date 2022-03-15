"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    timeline: "middleware/plugin/timeline"
}).define(["base", "element", "timeline"], async function (exports) {

    var request = layui.request;
    var common = layui.common;
    var setter = layui.setter;
    var timeline = layui.timeline;
    var $ = layui.$;

    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    request.when({
        deferreds: [
            { name: "project", url: "/prj/info", data: { id: $("#id").val() } },
            { name: "dynamics", url: "/prj/dynamic/list", data: { project_id: $("#id").val() } },
            { name: "transfer", url: "/prj/transfer/list", data: { project_id: $("#id").val() } }
        ],
        success: function (result) {
            var project = result.project;
            $("#project_code").html(project.project_code);
            $("#project_name").html(project.project_name);
            $("#project_type").html(ProjectType.Formatter(project.project_type));
            $("#follow_status").html(FollowStatus.Formatter(project.follow_status));
            $("#address").html(common.formatRegion(project));

            $("#custom_name").html(project.custom_name);
            $("#custom_address").html(project.custom_address);
            $("#contacts_name").html(project.contacts_name);
            $("#contacts_tel").html(project.contacts_tel);

            $("#responsible_name").html(project.responsible_name);
            $("#creater_name").html(project.creater_name);
            $("#create_time").html(project.create_time);
            $("#remark").html(project.remark);

            timeline.render({
                elem: "#dynamic-timeline",
                dateKey: "dynamic_time",
                contentKey: "message",
                data: result.dynamics,
                dateFormat: function (date) {
                    var date = new Date(date);
                    return date.format("yyyy年MM月dd日");
                }
            });

            timeline.render({
                elem: "#transfer-timeline",
                dateKey: "transfer_time",
                contentKey: "remark",
                data: result.transfer,
                dateFormat: function (date) {
                    var date = new Date(date);
                    return date.format("yyyy年MM月dd日");
                },
                parseData: function (data) {
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        item.title = item.transferor_name + " 移交到 " + item.receiver_name;
                    }
                    return data;
                }
            });
        }
    });

    //对外输出
    exports("main", {});
});