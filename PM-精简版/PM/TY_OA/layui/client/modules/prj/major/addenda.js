"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    timeline: "middleware/plugin/timeline",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "element", "timeline", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var timeline = layui.timeline;
    var $ = layui.$;

    var LAY_ADDENDA_MANAGE = "LAY-addenda-manage";

    /**
    * 初始化数据
    */
    table.load({
        elem: LAY_ADDENDA_MANAGE,
        url: "/prj/addenda/list",
        height: "full-50",
        clickClass: "layui-table-selected",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "内容标题", field: "title", align: "left" },
        ],
        fixed: { project_id: $("[name='project_id']").val() },
        done: function (instance, options) {
            timeline.render({
                elem: "#addenda-timeline",
                dateKey: "create_time",
                titleKey: "title",
                contentKey: "message",
                data: options.res.data,
                dateFormat: function (date) {
                    var date = new Date(date);
                    return date.format("yyyy年MM月dd日");
                }
            });
        },
        rowClick: function (row, index) {
            $("#addenda-timeline").children().eq(index).addClass("addenda_selected").siblings().removeClass("addenda_selected");
            $("#addenda-timeline").parent().animate({
                scrollTop: $("#addenda-timeline").children().eq(index).position().top
            }, 500);
        }
    });

    //对外输出
    exports("main", {});
});