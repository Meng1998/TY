"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    noticeEx: "middleware/lib/notice",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "noticeEx"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var setter = layui.setter;
    var notice = layui.notice;
    var request = layui.request;

    var LAY_PROJECT_MANAGE = "LAY-project-manage";
    var LAY_DYNAMUC_MANAGE = "LAY-dynamic-manage";
    var LAY_ADDENDA_MANAGE = "LAY-addenda-manage";
    var LAY_FEEDBACK_MANAGE = "LAY-feedback-manage";

    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    var user = layui.sessionData("session").user

    var tableInsProject;
    var tableInsDynamic;
    var tableInsAddenda;
    var tableInsFeedback;

    var toolbarEvent = {
        detail: function (row) {
            if (row) {
                if (row.ident === "CreateProject") {
                    detail({
                        content: "detail_simple.html",
                        area: ["500px", "681px"],
                        row: row,
                        setvalue: function (body, project) {
                            body.find("#project_code").html(project.project_code);
                            body.find("#project_name").html(project.project_name);
                            body.find("#project_type").html(ProjectType.Formatter(project.project_type));
                            body.find("#follow_status").html(FollowStatus.Formatter(project.follow_status));
                            body.find("#address").html(common.formatRegion(project));
                            body.find("#custom_name").html(project.custom_name);
                            body.find("#custom_address").html(project.custom_address);
                            body.find("#contacts_name").html(project.contacts_name);
                            body.find("#contacts_tel").html(project.contacts_tel);
                            body.find("#responsible_name").html(project.responsible_name);
                            body.find("#creater_name").html(project.creater_name);
                            body.find("#create_time").html(project.create_time.toDate());
                            body.find("#remark").html(project.remark);
                        }
                    }, tableInsProject);
                } else if (row.ident === "UpdateProjectFollowStatus" || row.ident === "UpdateProjectImportant") {
                    detail({
                        row: row,
                        setvalue: function (body, info) {
                            body.find("[name='id']").val(info.id);
                        }
                    }, tableInsProject);
                } else if (row.ident === "UpdateProjectResponsible") {
                    detail({
                        row: row,
                        setvalue: function (body, info) {
                            body.find("[name='id']").val(info.project_id);
                        }
                    }, tableInsProject);
                } else if (row.ident === "CreateDynamic") {
                    detail({
                        row: row,
                        setvalue: function (body, info) {
                            body.find("[name='id']").val(info.project_id);
                        }
                    }, tableInsDynamic);
                }
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        addenda: function (row) {
            detail({
                content: "detail_addenda.html",
                area: ["500px", "541px"],
                row: row,
                setvalue: function (body, info) {
                    body.find("[name='project_id']").val(info.project_id);
                }
            }, tableInsAddenda);
        },
        user_solution: function (row) {
            //个人方案
            var id;//获取自己记录的id
            for (let i = 0; i < row.examine.length; i++) {
                const item = row.examine[i];
                if (user.id === item.user_id) {
                    id = item.id;
                    break;
                }
            }
            var feedback = JSON.parse(row.params);
            common.openForm({
                title: "解决方案",
                content: "solution.html",
                area: ["500px", "529px"],
                fields: [
                    { dom: "type", value: "user" },
                    { dom: "id", value: id },
                    { dom: "project_name", value: feedback.project_name },
                    { dom: "title", value: feedback.title },
                    { dom: "message", value: feedback.message }
                ]
            });
        },
        feedback_solution: function (row) {
            var feedback = JSON.parse(row.params);
            //综合方案
            common.openForm({
                title: "解决方案",
                content: "solution.html",
                area: ["500px", "529px"],
                fields: [
                    { dom: "type", value: "feedback" },
                    { dom: "id", value: feedback.id },
                    { dom: "project_name", value: feedback.project_name },
                    { dom: "title", value: feedback.title },
                    { dom: "message", value: feedback.message },
                    { dom: "solution", value: feedback.solution }
                ]
            });
        },
        solution_view: function (row, obj) {
            var count = obj.tr.find("td[data-field='solution_user'] >> .layui-btn-disabled").length;
            if (count > 0) {
                layer.msg("无法查看方案详情！", { icon: 8 });
                return;
            }
            var feedback = JSON.parse(row.params);
            common.openForm({
                title: "方案详情",
                content: "solution_view.html",
                area: ["1000px", "433px"],
                btn: ["关闭"],
                fields: [
                    { dom: "id", value: feedback.id },
                    { dom: "project_name", value: feedback.project_name },
                    { dom: "title", value: feedback.title },
                    { dom: "message", value: feedback.message }
                ]
            });
        },
        confirm: function (row) {
            //确认
            var feedback = JSON.parse(row.params);
            //综合方案
            common.openForm({
                title: "确认方案",
                content: "solution.html",
                area: ["500px", "529px"],
                fields: [
                    { dom: "type", value: "confirm" },
                    { dom: "id", value: feedback.id },
                    { dom: "project_name", value: feedback.project_name },
                    { dom: "title", value: feedback.title },
                    { dom: "message", value: feedback.message },
                    { dom: "solution", value: feedback.solution }
                ],
                yes: function (data, index, layero) {
                    request.post({
                        url: "/work/notice/update",
                        data: { batch: row.batch, read_status: 1 },
                        success: function (result) {
                            layer.close(index);
                            tableInsFeedback.reload();
                        }
                    });
                }
            });
        }
    }

    function detail(options, table) {
        layer.open({
            type: 2,
            title: "项目详情",
            content: options.content ? options.content : "detail.html",
            area: options.area ? options.area : ["800px", "781px"],
            btn: options.btn ? options.btn : ["已阅", "关闭"],
            success: function (layero, index) {
                var body = layer.getChildFrame("body", index);
                var params = JSON.parse(options.row.params);
                if (options.setvalue) {
                    options.setvalue(body, params);
                }
            },
            yes: function (index) {
                read(options.row, table, index);
            }
        });
    }

    function read(row, table, index) {
        request.post({
            url: "/work/notice/update",
            data: { id: row.id, read_status: 1 },
            success: function (result) {
                layer.close(index);
                table.reload();
            }
        });
    }

    /**
    * 初始化数据
    */
    tableInsProject = table.load({
        elem: LAY_PROJECT_MANAGE,
        url: "/work/notice/list",
        height: "full-500",
        toolbarEvent: toolbarEvent,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "标题", field: "title", align: "center", width: 140 },
            { title: "创建人", field: "creater_name", align: "center", width: 80 },
            { title: "内容", field: "message", align: "center", templet: function (row) { return common.table.textLeft(row.message); } },
            { title: "操作", width: 90, align: "center", toolbar: "#detail-tool" }
        ],
        fixed: { read_status: 0, receiver_id: user.id, ident: ["CreateProject", "UpdateProjectImportant", "UpdateProjectFollowStatus", "UpdateProjectResponsible"] }
    });

    /**
    * 初始化数据
    */
    tableInsDynamic = table.load({
        elem: LAY_DYNAMUC_MANAGE,
        url: "/work/notice/list",
        height: "full-500",
        toolbarEvent: toolbarEvent,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "创建时间", field: "create_time", align: "center", width: 120, templet: function (row) { return new Date(row.create_time.UTCToBeiJing()).format("yyyy-MM-dd") } },
            { title: "创建人", field: "creater_name", align: "center", width: 80 },
            { title: "动态信息", align: "center", templet: function (row) { return common.table.batch(JSON.parse(row.params).message, ["innerText", "textLeft"]); } },
            { title: "操作", width: 90, align: "center", toolbar: "#detail-tool" }
        ],
        fixed: { read_status: 0, receiver_id: user.id, ident: "CreateDynamic" }
    });

    /**
    * 初始化数据
    */
    tableInsAddenda = table.load({
        elem: LAY_ADDENDA_MANAGE,
        url: "/work/notice/list",
        height: "full-500",
        toolbarEvent: toolbarEvent,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "创建时间", field: "create_time", align: "center", width: 120, templet: function (row) { return new Date(row.create_time.UTCToBeiJing()).format("yyyy-MM-dd") } },
            { title: "创建人", field: "creater_name", align: "center", width: 80 },
            { title: "所属项目", align: "center", width: 250, templet: function (row) { return JSON.parse(row.params).project_name; } },
            { title: "项目补充", align: "center", templet: function (row) { return common.table.batch(JSON.parse(row.params).message, ["innerText", "textLeft"]); } },
            { title: "操作", width: 90, align: "center", toolbar: "#detail-tool" }
        ],
        fixed: { read_status: 0, receiver_id: user.id, ident: "CreateAddenda" }
    });

    /**
    * 初始化数据
    */
    tableInsFeedback = table.load({
        elem: LAY_FEEDBACK_MANAGE,
        url: "/work/notice/list",
        height: "full-500",
        toolbarEvent: toolbarEvent,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "创建时间", field: "create_time", align: "center", width: 120, templet: function (row) { return new Date(row.create_time.UTCToBeiJing()).format("yyyy-MM-dd") } },
            { title: "创建人", field: "creater_name", align: "center", width: 80 },
            { title: "所属项目", align: "center", width: 250, templet: function (row) { return JSON.parse(row.params).project_name; } },
            { title: "问题反馈", align: "center", templet: function (row) { return common.table.batch(JSON.parse(row.params).message, ["innerText", "textLeft"]); } },
            { title: "审核人", field: "solution_user", width: 330, align: "center", toolbar: "#user-tool" },
            { title: "操作", width: 100, align: "center", toolbar: "#solution-tool" }
        ],
        fixed: { read_status: 0, receiver_id: user.id, ident: "CreateFeedback" },
        done: function (instance, options) {
            var that = instance.elem.next();
            options.res.data.forEach(function (item, index) {
                var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");
                var count = tr.find("td[data-field='solution_user'] >> .layui-btn-disabled").length;
                if (count === 0) {
                    tr.css("background-color", "#5FB878");
                    tr.css("color", "#fff");
                }
            });
        }
    });

    //消息通知
    window.notice = function (ident) {
        var type = ""
        switch (ident) {
            case "notice.project":
                tableInsProject.reload();
                type = "跟进项目";
                break;
            case "notice.dynamic":
                tableInsDynamic.reload();
                type = "项目动态";
                break;
            case "notice.addenda":
                tableInsAddenda.reload();
                type = "项目补充";
                break;
            case "notice.feedback":
                tableInsFeedback.reload();
                type = "问题反馈";
                break;
        }
        // if (type) {
        //     notice.inf({
        //         message: type + " 数据有更新！"
        //     });
        // }
    }

    //对外输出
    exports("main", {});
});