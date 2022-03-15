"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    noticeEx: "middleware/lib/notice",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "laydate", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var setter = layui.setter;
    var form = layui.form;
    var laydate = layui.laydate

    var LAY_NOTICE_MANAGE = "LAY-notice-manage";

    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);

    var user = layui.sessionData("session").user

    laydate.render({
        elem: "input[name='start_time']",
        done: function (value, date) {
            //更新结束日期的最小日期
            end_time.config.min = lay.extend({}, date, {
                month: date.month - 1
            });

            //自动弹出结束日期的选择器
            end_time.config.elem[0].focus();
        }
    });

    var end_time = laydate.render({
        elem: "input[name='end_time']"
    });

    var tableIns;
    var toolbarEvent = {
        detail: function (row) {
            if (row) {
                if (row.ident === "CreateProject") {
                    detail({
                        content: "detail_simple.html",
                        area: ["500px", "681px"],
                        row: row,
                        setvalue: function (body, project) {
                            body.find("#project_name").html(project.project_name);
                            body.find("#project_type").html(ProjectType.Formatter(project.project_type));
                            body.find("#follow_status").html(FollowStatus.Formatter(project.follow_status));
                            body.find("#address").html(common.formatRegion(project));
                            body.find("#custom_name").html(project.custom_name);
                            body.find("#custom_address").html(project.custom_address);
                            body.find("#contacts_name").html(project.contacts_name);
                            body.find("#contacts_tel").html(project.contacts_tel);
                            body.find("#creater_name").html(project.creater_name);
                            body.find("#create_time").html(project.create_time);
                            body.find("#remark").html(project.remark);
                        }
                    });
                } else if (row.ident === "UpdateProjectFollowStatus" || row.ident === "UpdateProjectImportant") {
                    detail({
                        row: row,
                        setvalue: function (body, info) {
                            body.find("[name='id']").val(info.id);
                        }
                    });
                } else if (row.ident === "UpdateProjectResponsible") {
                    detail({
                        row: row,
                        setvalue: function (body, info) {
                            body.find("[name='id']").val(info.project_id);
                        }
                    });
                } else if (row.ident === "CreateDynamic") {
                    detail({
                        row: row,
                        setvalue: function (body, info) {
                            body.find("[name='id']").val(info.project_id);
                        }
                    });
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
            });
        },
        solution: function (row, obj) {
            var feedback = JSON.parse(row.params);
            common.openForm({
                title: "方案详情",
                content: "solution.html",
                area: ["1000px", "433px"],
                btn: ["关闭"],
                fields: [
                    { dom: "id", value: feedback.id },
                    { dom: "project_name", value: feedback.project_name },
                    { dom: "title", value: feedback.title },
                    { dom: "message", value: feedback.message }
                ]
            });
        }
    }

    function detail(options) {
        layer.open({
            type: 2,
            title: "项目详情",
            content: options.content ? options.content : "detail.html",
            area: options.area ? options.area : ["800px", "781px"],
            btn: options.btn ? options.btn : ["关闭"],
            success: function (layero, index) {
                var body = layer.getChildFrame("body", index);
                var params = JSON.parse(options.row.params);
                if (options.setvalue) {
                    options.setvalue(body, params);
                }
            }
        });
    }

    /**
    * 初始化数据
    */
    tableIns = table.load({
        elem: LAY_NOTICE_MANAGE,
        url: "/work/notice/list",
        toolbarEvent: toolbarEvent,
        row: false,
        cols: [
            { type: "numbers" },
            { align: "center", width: 50, templet: function (row) { return row.read_status === 0 ? "<i class='fa fa-envelope'></i>" : "<i class='fa fa-envelope-open-o'></i>"; } },
            { title: "创建时间", field: "create_time", align: "center", width: 120, templet: function (row) { return new Date(row.create_time.UTCToBeiJing()).format("yyyy-MM-dd") } },
            { title: "标题", field: "title", align: "center", width: 140 },
            { title: "创建人", field: "creater_name", align: "center", width: 80 },
            {
                title: "内容", field: "message", align: "center", templet: function (row) {
                    switch (row.type) {
                        case "project":
                            return common.table.textLeft(row.message);
                        case "feedback":
                            var param = JSON.parse(row.params);
                            return common.table.textLeft(common.table.textBlue(param.project_name) + "：" + param.message);
                        default:
                            return common.table.batch(JSON.parse(row.params).message, ["innerText", "textLeft"]);
                    }
                }
            },
            { title: "操作", width: 100, align: "center", toolbar: "#tool" }
        ],
        fixed: { receiver_id: user.id }
    });

    //监听搜索
    form.on("submit(LAY-notice-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-notice-reset)", function (data) {
        tableIns.reset(data);
    });

    //对外输出
    exports("main", {});
});