"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "element", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var setter = layui.setter;
    var element = layui.element;
    var request = layui.request;
    var util = layui.util;
    var form = layui.form;
    var $ = layui.$;

    //刷新通知
    var noticeRefresh = true;

    var LAY_CONDUCT_PROJECT_MANAGE = "LAY-conduct-project-manage";
    var LAY_TOTAL_PROJECT_MANAGE = "LAY-total-project-manage";

    var user = layui.sessionData("session").user;

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    var tableInsConduct;

    var toolbarEvent = {
        function: function (row) {
            if (row) {
                common.openForm({
                    title: "功能需求：" + row.project_name,
                    content: "function.html",
                    area: ["1400px", "764px"],
                    btn: ["关闭"],
                    fields: [{ dom: "project_id", value: row.id }, { dom: "project_name", value: row.project_name }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        addenda: function (row) {
            if (row) {
                common.openForm({
                    title: "项目补充：" + row.project_name,
                    content: "addenda.html",
                    area: ["1000px", "664px"],
                    btn: ["关闭"],
                    fields: [{ dom: "project_id", value: row.id }, { dom: "project_name", value: row.project_name }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        feedback: function (row) {
            if (row) {
                common.openForm({
                    title: "项目反馈：" + row.project_name,
                    content: "feedback.html",
                    area: ["1600px", "664px"],
                    btn: ["关闭"],
                    fields: [{ dom: "project_id", value: row.id }, { dom: "project_name", value: row.project_name }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    /**
    * 初始化数据
    */
    tableInsConduct = table.load({
        elem: LAY_CONDUCT_PROJECT_MANAGE,
        url: "/prj/info/list",
        height: "full-150",
        toolbar: "#conduct-toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目名称", field: "project_name", align: "center" },
            { title: "项目类型", field: "project_type", align: "center", width: 90, templet: function (row) { return ProjectType.Formatter(row.project_type); } },
            { title: "项目归属地", align: "center", width: 180, templet: function (row) { return common.formatRegion(row) } },
            { title: "客户名称", field: "custom_name", align: "center", width: 250 },
            { title: "客户联系人", field: "contacts_name", align: "center", width: 100 },
            { title: "联系人电话", field: "contacts_tel", align: "center", width: 120 },
            { title: "操作", width: 240, align: "center", fixed: "right", toolbar: "#conduct-tool" }
        ],
        fixed: { person_id: user.id, project_status: ProjectStatus.conduct }
    });

    element.on("tab(LAY-project-manage)", function (data) {

    });

    //监听搜索
    form.on("submit(LAY-conduct-project-search)", function (data) {
        tableInsConduct.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-conduct-project-reset)", function (data) {
        tableInsConduct.reset(data);
    });

    //对外输出
    exports("main", {});
});