"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    dropdown: "plugin/dropdown",//表格扩展
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "dropdown", "element", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var setter = layui.setter;
    var request = layui.request;
    var util = layui.util;
    var form = layui.form;
    var $ = layui.$;

    //刷新通知
    var noticeRefresh = true;

    var LAY_PROJECT_MANAGE = "LAY-project-manage";

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    request.post({
        url: "/sys/user/list",
        data: {
            dept_id: "a53c3b30-bbc9-11ea-b9ee-f5f1d3668986",//项目部Id
            job_status: "1"         //在职
        },
        success: function (data) {
            for (let i = 0; i < data.list.length; i++) {
                const item = data.list[i];
                $(".dropdown-menu-nav").append("<li><a>" + item.full_name + "</li>");
            }
        }
    });

    var toolbarEvent = {
        person: function (row) {
            if (row) {
                if (row.person_name) {
                    layer.msg("该项目已分配人员", { icon: 8 });
                    return;
                }
                common.openForm({
                    title: "分配项目经理",
                    content: "person.html",
                    area: ["300px", "500px"],
                    fields: [{ dom: "id", value: row.id }, { dom: "project_name", value: row.project_name }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        transfer: function (row) {
            if (row) {
                if (!row.person_name) {
                    layer.msg("该项目未分配人员", { icon: 8 });
                    return;
                }
                common.openForm({
                    title: "项目移交",
                    content: "transfer.html",
                    area: ["300px", "500px"],
                    fields: [{ dom: "id", value: row.id }, { dom: "project_name", value: row.project_name }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        edit: function (row) {
            if (row) {
                common.openForm({
                    title: "编辑项目",
                    content: "edit.html",
                    area: ["1300px", "664px"],
                    fields: [{ dom: "id", value: row.id }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        finish: function (row) {
            common.operation({
                url: "/prj/info/update",
                data: {
                    id: row.id,
                    project_status: ProjectStatus.finish
                }
            }, row, {
                prompt: "是否将<font color='#0000FF' style='cursor:pointer'>" + row.project_name + "</font>设置为完结项目？",
                success: "项目提交成功!"
            });
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PROJECT_MANAGE,
        url: "/prj/info/list",
        toolbar: "#toolbar",
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
            { title: "重点关注", align: "center", width: 95, toolbar: "#emphasis-tool" },
            { title: "操作", width: 190, align: "center", fixed: "right", toolbar: "#tool" }
        ],
        fixed: { project_status: ProjectStatus.conduct }
    });

    //监听分配操作
    form.on('switch(emphasis)', function (obj) {
        var data = {
            id: obj.value,
            emphasis: obj.elem.checked ? 1 : 0
        }

        noticeRefresh = false;
        request.post({
            url: "/prj/info/update",
            data: data,
            success: function (result) {
                layer.msg("保存成功！", { icon: 1 });
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

    //消息通知
    window.notice = function (ident) {
        if (ident === "project") {
            if (noticeRefresh) {
                tableIns.reload();
            }
        }
        noticeRefresh = true;
    }

    //对外输出
    exports("main", {});
});