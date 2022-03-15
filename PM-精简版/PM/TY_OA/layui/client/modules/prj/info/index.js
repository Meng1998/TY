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
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);
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

    var toolbarEvent = {
        detail: function (row) {
            if (row) {
                layer.open({
                    type: 2,
                    title: "项目详情",
                    content: "detail.html",
                    area: ["800px", "781px"],
                    btn: ["关闭"],
                    success: function (layero, index) {
                        var body = layer.getChildFrame("body", index);
                        body.find("[name='id']").val(row.id);
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PROJECT_MANAGE,
        url: "/prj/info/list",
        height: "full-150",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center" },
            { title: "项目类型", field: "project_type", align: "center", width: 100, templet: function (row) { return ProjectType.Formatter(row.project_type); } },
            { title: "项目归属地", align: "center", width: 230, templet: function (row) { return common.formatRegion(row) } },
            { title: "合同状态", field: "contract_status", align: "center", width: 100, templet: function (row) { return ContractStatus.Formatter(row.contract_status); } },
            { title: "负责人", field: "responsible_name", align: "center", width: 100 },
            { title: "创建时间", field: "create_time", align: "center", width: 120 },
            { title: "客户名称", field: "custom_name", align: "center", width: 250 },
            { title: "客户联系人", field: "contacts_name", align: "center", width: 120 },
            { title: "联系人电话", field: "contacts_tel", align: "center", width: 120 },
            { title: "操作", width: 100, align: "center", fixed: "right", toolbar: "#tool" }
        ]
    });

    element.on("tab(LAY-project-manage)", function (data) {
        var type = $(this).data("type");
        tableIns.reload({
            where: {
                project_status: (type === "total") ? "" : ProjectStatus[type]
            }, page: {
                curr: 1
            }
        });
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

    //对外输出
    exports("main", {});
});