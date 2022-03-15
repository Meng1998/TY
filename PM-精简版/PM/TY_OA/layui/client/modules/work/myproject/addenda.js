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
    var setter = layui.setter;
    var element = layui.element;
    var request = layui.request;
    var util = layui.util;
    var form = layui.form;
    var timeline = layui.timeline;
    var $ = layui.$;

    var LAY_ADDENDA_MANAGE = "LAY-addenda-manage";

    var tableIns;

    var toolbarEvent = {
        add: function () {
            common.openForm({
                layer: parentLayer,
                window: window.parent,
                title: "新建项目补充",
                content: "addenda_add.html",
                area: ["600px", "541px"],
                fields: [{ dom: "project_id", value: $("[name='project_id']").val() }, { dom: "project_name", value: $("[name='project_name']").val() }],
                yes: function () {
                    tableIns.reload();
                }
            });
        },
        delete: function (row) {
            common.operation({
                layer: parentLayer,
                url: "/prj/addenda/delete",
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
        elem: LAY_ADDENDA_MANAGE,
        url: "/prj/addenda/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        height: "full-50",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "内容标题", field: "title", align: "left" },
            { title: "重点关注", width: 140, align: "center", toolbar: "#important-tool" },
            { title: "操作", width: 65, align: "center", toolbar: "#tool" },
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

    //监听分配操作
    form.on('checkbox(important)', function (obj) {
        var data = {
            id: obj.value,
            project_id: $("[name='project_id']").val(),
            important: obj.elem.checked ? 1 : 0
        }

        request.post({
            url: "/prj/addenda/update",
            data: data,
            success: function (result) {
                parentLayer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //对外输出
    exports("main", {});
});