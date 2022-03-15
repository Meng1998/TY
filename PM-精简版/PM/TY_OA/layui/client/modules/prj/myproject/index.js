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

    var LAY_MINE_PROJECT_MANAGE = "LAY-mine-project-manage";

    var user = layui.sessionData("session").user;

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);
    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    var tableInsMine;

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
        add: function () {
            common.openForm({
                title: "添加项目",
                content: "form.html",
                area: ["1300px", "664px"],
                fields: [{ dom: "creater_id", value: user.id }, { dom: "creater_name", value: user.full_name }]
            });
        },
        edit: function (row) {
            if (row) {
                common.openForm({
                    title: "编辑项目",
                    content: "form.html",
                    area: ["1300px", "664px"],
                    fields: [{ dom: "id", value: row.id }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        dynamic: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "添加项目动态",
                    content: "dynamic.html",
                    area: ["600px", "545px"],
                    row: row,
                    fields: [{ dom: "project_id", name: "id" }, "project_name", "creater_id", "creater_name"]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        transfer: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "选择人员",
                    content: "transfer.html",
                    area: ["400px", "400px"],
                    row: row,
                    fields: [{ dom: "project_id", name: "id" }, { dom: "project_name", name: "project_name" }, { dom: "transferor_id", name: "responsible_id" }, { dom: "transferor_name", name: "responsible_name" }]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        implement: function (row) {
            common.operation({
                url: "/prj/info/update",
                data: {
                    id: row.id,
                    project_status: ProjectStatus.conduct
                }
            }, row, {
                prompt: "是否将<font color='#0000FF' style='cursor:pointer'>" + row.project_name + "</font>提交到项目部？",
                success: "项目提交成功!"
            });
        },
        detail: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "项目详情",
                    content: "detail.html",
                    area: ["800px", "781px"],
                    btn: ["关闭"],
                    row: row,
                    fields: ["id"]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        overdue: function (row) {
            common.operation({
                url: "/prj/info/update",
                data: {
                    id: row.id,
                    project_status: ProjectStatus.overdue
                }
            }, row, {
                prompt: "是否将<font color='#0000FF' style='cursor:pointer'>" + row.project_name + "</font>设为过期项目？",
                success: "已设为过期项目!"
            });
        },
        follow: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "跟进状态：" + row.project_name,
                    content: "follow.html",
                    area: ["400px", "178px"],
                    btn: ["关闭"],
                    row: row,
                    fields: ["id", "project_name"]
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    /**
    * 初始化数据
    */
    tableInsMine = table.load({
        elem: LAY_MINE_PROJECT_MANAGE,
        url: "/prj/info/list",
        toolbar: "#mine-toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center" },
            { title: "项目类型", field: "project_type", align: "center", width: 90, templet: function (row) { return ProjectType.Formatter(row.project_type); } },
            { title: "项目归属地", align: "center", width: 180, templet: function (row) { return common.formatRegion(row) } },
            { title: "跟进状态", field: "follow_status", align: "center", width: 90, event: "follow", templet: function (row) { return FollowStatus.Formatter(row.follow_status); } },
            { title: "客户名称", field: "custom_name", align: "center", width: 200 },
            { title: "联系人", field: "contacts_name", align: "center", width: 80 },
            { title: "联系人电话", field: "contacts_tel", align: "center", width: 120 },
            { title: "最近联系", align: "center", width: 90, templet: function (row) { if (row.dynamic) { var differDay = row.dynamic.DifferDay(); if (differDay >= 180) { return "六个月年前"; } else if (differDay >= 150) { return "五个月前"; } else if (differDay >= 120) { return "四个月前"; } else if (differDay >= 90) { return "三个月前"; } else if (differDay >= 60) { return "两个月前"; } else if (differDay >= 30) { return "一个月前"; } else { return row.dynamic.toDate("MM月dd日"); } } else { return ""; } } },
            { title: "重点关注", width: 140, align: "center", toolbar: "#important-tool" },
            { title: "操作", width: 300, align: "center", fixed: "right", toolbar: "#mine-tool" }
        ],
        fixed: { responsible_id: user.id, project_status: ProjectStatus.follow }
    });

    //监听分配操作
    form.on('checkbox(important)', function (obj) {
        var data = {
            id: obj.value,
            important: obj.elem.checked ? 1 : 0
        }

        var list = table.cache[LAY_MINE_PROJECT_MANAGE];
        var projectData;
        //获取当前行数据
        for (let j = 0; j < list.length; j++) {
            const item = list[j];
            if (item.id === data.id) {
                projectData = item;
                projectData.important = data.important;
                break;
            }
        }

        var noticeMsg = null;
        if (obj.elem.checked) {
            //拼接消息通知
            noticeMsg = {
                ident: "UpdateProjectImportant",
                param: [projectData.project_name]
            }
            data.notice = noticeMsg;
            data.notice.user_id = user.id;
            data.notice.user_name = user.full_name;
            data.notice.data = JSON.stringify(projectData);
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
    form.on("submit(LAY-mine-project-search)", function (data) {
        tableInsMine.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-mine-project-reset)", function (data) {
        tableInsMine.reset(data);
    });

    //消息通知
    window.notice = function (ident) {
        if (ident === "project") {
            if (noticeRefresh) {
                tableInsMine.reload();
            }
            noticeRefresh = true;
        }
    }

    //对外输出
    exports("main", {});
});