"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    timeline: "middleware/plugin/timeline"
}).define(["base", "timeline"], async function (exports) {

    var request = layui.request;
    var timeline = layui.timeline;
    var $ = layui.$;

    request.post({
        url: "/prj/addenda/list",
        data: { project_id: $("[name='project_id']").val() },
        success: function (data) {
            timeline.render({
                elem: "#addenda-timeline",
                dateKey: "create_time",
                titleKey: "title",
                contentKey: "message",
                data: data.list,
                dateFormat: function (date) {
                    var date = new Date(date);
                    return date.format("yyyy年MM月dd日");
                }
            });
        }
    });

    //对外输出
    exports("main", {});
});