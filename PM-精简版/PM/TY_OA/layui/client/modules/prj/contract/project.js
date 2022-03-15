"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "element", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var setter = layui.setter;
    var element = layui.element;
    var request = layui.request;
    var util = layui.util;
    var form = layui.form;
    var $ = layui.$;

    var LAY_PROJECT_MANAGE = "LAY-project-manage";

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);
    //项目合同状态
    var ContractStatus = await layui.base.dictionary(setter.dictionary.ContractStatus);

    request.post({
        url: "/prj/responsible/list",
        success: function (data) {
            for (let i = 0; i < data.list.length; i++) {
                const item = data.list[i];
                $("[name='responsible_id']").append("<option value='" + item.user_id + "'>" + item.full_name + "</option>");
            }

            form.render();
        }
    });

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PROJECT_MANAGE,
        url: "/prj/info/list",
        height: "full-100",
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center" },
            { title: "项目归属地", align: "center", width: 230, templet: function (row) { return common.formatRegion(row) } },
            { title: "负责人", field: "person_name", align: "center", width: 100 },
            { title: "客户名称", field: "custom_name", align: "center", width: 300 }
        ],
        fixed: { contract_status: ContractStatus.nosigned, project_status: [ProjectStatus.conduct, ProjectStatus.finish] }
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

    window.submit = function (callback) {
        if (!tableIns.selected) {
            parentLayer.msg("请选择数据！", { icon: 8 });
            return;
        }
        callback("添加合同信息！", tableIns.selected);
    }

    //对外输出
    exports("main", {});
});