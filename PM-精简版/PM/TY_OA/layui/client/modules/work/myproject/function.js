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
    var common = layui.common;
    var request = layui.request;
    var form = layui.form;
    var $ = layui.$;

    var LAY_FUNCTION_MANAGE = "LAY-function-manage";

    var tableIns;

    var toolbarEvent = {
        add: function () {
            common.openForm({
                layer: parentLayer,
                window: window.parent,
                title: "新建功能需求",
                content: "function_add.html",
                area: ["600px", "701px"],
                fields: [{ dom: "project_id", value: $("[name='project_id']").val() }, { dom: "project_name", value: $("[name='project_name']").val() }],
                yes: function () {
                    tableIns.reload();
                }
            });
        },
        delete: function (row) {
            common.operation({
                layer: parentLayer,
                url: "/prj/function/delete",
                data: {
                    id: row.id
                },
                success: function () {
                    tableIns.reload();
                }
            }, row, {
                prompt: "是否删除<font color='#0000FF' style='cursor:pointer'>" + row.title + "</font>？",
                success: "数据已删除!"
            });
        }
    }

    /**
    * 初始化数据
    */
    tableIns = table.load({
        elem: LAY_FUNCTION_MANAGE,
        url: "/prj/function/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        height: "full-50",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "内容标题", width: 150, field: "title", align: "center" },
            { title: "内容详情", field: "message", align: "center", templet: function (row) { return common.table.textLeft("<pre>" + row.message + "</pre>"); } },
            { title: "备注信息", width: 250, field: "remark", align: "center", templet: function (row) { return "<pre>" + row.remark + "</pre>"; } },
            { title: "当前状态", width: 110, align: "center", toolbar: "#status-tool" },
            { title: "操作", width: 65, align: "center", toolbar: "#tool" },
        ],
        fixed: { project_id: $("[name='project_id']").val() }
    });

    //监听分配操作
    form.on('checkbox(status)', function (obj) {
        var data = {
            id: obj.value,
            project_id: $("[name='project_id']").val(),
            status: obj.elem.checked ? 1 : 0
        }

        request.post({
            url: "/prj/function/update",
            data: data,
            success: function (result) {
                layer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //对外输出
    exports("main", {});
});