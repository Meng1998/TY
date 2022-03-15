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
    var form = layui.form;

    var LAY_FOLLOW_PROJECT_MANAGE = "LAY-follow-project-manage";
    var LAY_CONDUCT_PROJECT_MANAGE = "LAY-conduct-project-manage";

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);
    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    var tableInsFollow;
    var tableInsConduct;

    var toolbarEvent = {
        dynamic: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "项目详情",
                    content: "dynamic.html",
                    area: ["800px", "781px"],
                    btn: ["关闭"],
                    row: row,
                    fields: ["id"]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
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
                    area: ["800px", "664px"],
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
    tableInsFollow = table.load({
        elem: LAY_FOLLOW_PROJECT_MANAGE,
        url: "/prj/info/list",
        height: "full-150",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center" },
            { title: "项目类型", field: "project_type", align: "center", width: 90, templet: function (row) { return ProjectType.Formatter(row.project_type); } },
            { title: "项目归属地", align: "center", width: 180, templet: function (row) { return common.formatRegion(row) } },
            { title: "跟进状态", field: "follow_status", align: "center", width: 90, event: "follow", templet: function (row) { return FollowStatus.Formatter(row.follow_status); } },
            { title: "负责人", field: "responsible_name", align: "center", width: 100 },
            { title: "客户名称", field: "custom_name", align: "center", width: 250 },
            { title: "客户联系人", field: "contacts_name", align: "center", width: 120 },
            { title: "联系人电话", field: "contacts_tel", align: "center", width: 120 },
            { title: "最近联系", align: "center", width: 90, templet: function (row) { if (row.dynamic) { var differDay = row.dynamic.DifferDay(); if (differDay >= 180) { return "六个月年前"; } else if (differDay >= 150) { return "五个月前"; } else if (differDay >= 120) { return "四个月前"; } else if (differDay >= 90) { return "三个月前"; } else if (differDay >= 60) { return "两个月前"; } else if (differDay >= 30) { return "一个月前"; } else { return row.dynamic.toDate("MM月dd日"); } } else { return ""; } } },
            { title: "操作", width: 100, align: "center", fixed: "right", toolbar: "#follow-tool" }
        ],
        fixed: { project_status: ProjectStatus.follow, important: 1 }
    });

    element.on("tab(LAY-project-manage)", function (data) {
        //第一次加载
        if (!tableInsConduct) {
            tableInsConduct = table.load({
                elem: LAY_CONDUCT_PROJECT_MANAGE,
                url: "/prj/info/list",
                height: "full-150",
                toolbarEvent: toolbarEvent,
                cols: [
                    { type: "numbers" },
                    { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
                    { title: "项目名称", field: "project_name", align: "center" },
                    { title: "项目类型", field: "project_type", align: "center", width: 100, templet: function (row) { return ProjectType.Formatter(row.project_type); } },
                    { title: "项目归属地", align: "center", width: 230, templet: function (row) { return common.formatRegion(row) } },
                    { title: "项目经理", field: "person_name", align: "center", width: 100, templet: function (row) { return (!row.person_name) ? "<font color='#FF0000'>未分配</font>" : "<font color='#0000FF'>" + row.person_name + "</font>" } },
                    { title: "客户名称", field: "custom_name", align: "center", width: 250 },
                    { title: "客户联系人", field: "contacts_name", align: "center", width: 120 },
                    { title: "联系人电话", field: "contacts_tel", align: "center", width: 120 },
                    { title: "操作", width: 250, align: "center", fixed: "right", toolbar: "#conduct-tool" }
                ],
                fixed: { project_status: ProjectStatus.conduct, emphasis: 1 }
            });
        }
    });

    //监听搜索
    form.on("submit(LAY-follow-project-search)", function (data) {
        tableInsFollow.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-follow-project-reset)", function (data) {
        tableInsFollow.reset(data);
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

    //消息通知
    window.notice = function (ident) {
        if (ident === "project") {
            tableInsFollow.reload();
            if (tableInsConduct) {
                tableInsConduct.reload();
            }
        }
    }

    //对外输出
    exports("main", {});
});