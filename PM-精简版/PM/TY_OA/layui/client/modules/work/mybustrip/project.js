"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var setter = layui.setter;
    var form = layui.form;

    var LAY_PROJECT_MANAGE = "LAY-project-manage";

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PROJECT_MANAGE,
        url: "/prj/info/list",
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 170, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center", width: 300 },
            { title: "项目归属地", align: "center", width: 250, templet: function (row) { return common.formatRegion(row) } },
            { title: "当前状态", field: "project_status", align: "center", width: 100, templet: function (row) { return ProjectStatus.Formatter(row.project_status); } },
            { title: "客户名称", field: "custom_name", align: "center", width: 250 },
            { title: "客户联系人", field: "contacts_name", align: "center", width: 120 },
            { title: "联系人电话", field: "contacts_tel", align: "center", width: 120 }
        ]
    });

    //监听搜索
    form.on("submit(LAY-project-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-project-reset)", function (data) {
        tableIns.reset(data);
    });

    /**
     * 提交数据
     */
    window.select = function (callback) {
        callback(tableIns.selected);
    }

    //对外输出
    exports("main", {});
});