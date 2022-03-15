"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    timeline: "middleware/plugin/timeline",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var $ = layui.$;

    var LAY_FUNCTION_MANAGE = "LAY-function-manage";

    /**
    * 初始化数据
    */
    table.load({
        elem: LAY_FUNCTION_MANAGE,
        url: "/prj/function/list",
        height: "full-50",
        page: false,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "内容标题", width: 150, field: "title", align: "center" },
            { title: "内容详情", field: "message", align: "center", templet: function (row) { return common.table.textLeft("<pre>" + row.message + "</pre>"); } },
            { title: "备注信息", width: 300, field: "remark", align: "center", templet: function (row) { return "<pre>" + row.remark + "</pre>"; } },
            { title: "当前状态", width: 110, align: "center", templet: function (row) { return (row.status === 1) ? common.table.textBlue("已完成") : common.table.textBlue("未完成") } }
        ],
        fixed: { project_id: $("[name='project_id']").val() }
    });

    //对外输出
    exports("main", {});
});