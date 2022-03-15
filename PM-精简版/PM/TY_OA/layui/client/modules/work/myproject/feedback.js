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

    var LAY_NOFINISHED_FEEDBACK_MANAGE = "LAY-nofinished-feedback-manage";
    var LAY_FINISHED_FEEDBACK_MANAGE = "LAY-finish-feedback-manage";
    var LAY_REJECT_FEEDBACK_MANAGE = "LAY-reject-feedback-manage";

    var tableInsNofinished;
    var tableInsFinish;
    var tableInsReject;

    //项目反馈完成状态
    var FinishStatus = await layui.base.dictionary(setter.dictionary.FinishStatus);
    //项目反馈类型
    var FeedbackType = await layui.base.dictionary(setter.dictionary.FeedbackType);

    var toolbarEvent = {
        add: function () {
            common.openForm({
                layer: parentLayer,
                window: window.parent,
                title: "新建项目反馈",
                content: "feedback_add.html",
                area: ["500px", "524px"],
                fields: [{ dom: "project_id", value: $("[name='project_id']").val() }, { dom: "project_name", value: $("[name='project_name']").val() }]
            });
        },
        identified: function (row) {
            if (row) {
                common.operation({
                    layer: parentLayer,
                    url: "/prj/feedback/update",
                    data: {
                        id: row.id,
                        finished_time: new Date().format("yyyy-MM-dd"),
                        identified: 1
                    },
                    verify: function () {
                        //完成或驳回
                        return (row.status === FinishStatus.finished || row.status === FinishStatus.reject);
                    }
                }, row, {
                    prompt: "是否确认完成<font color='#0000FF' style='cursor:pointer'>" + row.title + "</font>？",
                    success: "数据已修改!"
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        delete: function (row) {
            if (row) {
                var noticeMsg = { ident: "DeleteFeedback", param: [] }//删除通知
                common.operation({
                    layer: parentLayer,
                    url: "/prj/feedback/delete",
                    data: {
                        id: row.id
                    },
                    verify: function () {
                        for (let i = 0; i < row.examine.length; i++) {
                            const item = row.examine[i];
                            if (item.solution) {
                                return false;
                            }
                        }
                        return row.designee_id ? false : true;
                    }
                }, row, {
                    prompt: "是否删除<font color='#0000FF' style='cursor:pointer'>" + row.title + "</font>？",
                    success: "数据已删除!"
                }, noticeMsg);
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        status: function (row) {
            if (row.status === FinishStatus.reject) {
                parentLayer.alert("<pre>" + row.reject_reason + "</pre>", {
                    title: "驳回原因"
                });
            }
        }
    }

    /**
    * 初始化数据
    */
    tableInsNofinished = table.load({
        elem: LAY_NOFINISHED_FEEDBACK_MANAGE,
        url: "/prj/feedback/list",
        height: "full-100",
        toolbar: "#nofinished-toolbar",
        toolbarEvent: toolbarEvent,
        page: false,
        cols: [
            { type: "numbers" },
            { title: "内容标题", width: 250, field: "title", align: "center" },
            { title: "内容类型", width: 100, field: "type", align: "center", templet: function (row) { return FeedbackType.Formatter(row.type); } },
            { title: "当前状态", width: 100, field: "status", align: "center", event: "status", templet: function (row) { return FinishStatus.Formatter(row.status); } },
            { title: "被指派人", width: 100, field: "designee_name", align: "center" },
            { title: "预计完成时间", width: 130, field: "estimate_time", align: "center" },
            { title: "问题描述", field: "message", align: "center", templet: function (row) { return common.table.textLeft(row.message); } },
            { title: "重点关注", width: 140, align: "center", toolbar: "#important-tool" },
            { title: "操作", width: 120, align: "center", fixed: "right", toolbar: "#nofinished-tool" }
        ],
        fixed: { project_id: $("[name='project_id']").val(), identified: 0 }
    });

    element.on("tab(LAY-project-manage)", function (data) {
        //第一次加载
        if (!tableInsFinish && data.index === 1) {
            tableInsFinish = table.load({
                elem: LAY_FINISHED_FEEDBACK_MANAGE,
                url: "/prj/feedback/list",
                height: "full-100",
                page: false,
                cols: [
                    { type: "numbers" },
                    { title: "内容标题", width: 250, field: "title", align: "center" },
                    { title: "内容类型", width: 100, field: "type", align: "center", templet: function (row) { return FeedbackType.Formatter(row.type); } },
                    { title: "被指派人", width: 100, field: "designee_name", align: "center" },
                    { title: "完成时间", width: 130, field: "finished_time", align: "center" },
                    { title: "问题描述", field: "message", align: "center", templet: function (row) { return common.table.textLeft(row.message); } }
                ],
                fixed: { project_id: $("[name='project_id']").val(), status: FinishStatus.finished, identified: 1 }
            });
        }

        if (!tableInsReject && data.index === 2) {
            tableInsReject = table.load({
                elem: LAY_REJECT_FEEDBACK_MANAGE,
                url: "/prj/feedback/list",
                height: "full-100",
                page: false,
                cols: [
                    { type: "numbers" },
                    { title: "内容标题", width: 250, field: "title", align: "center" },
                    { title: "内容类型", width: 100, field: "type", align: "center", templet: function (row) { return FeedbackType.Formatter(row.type); } },
                    { title: "问题描述", field: "message", align: "center", templet: function (row) { return common.table.textLeft(row.message); } },
                    { title: "驳回原因", field: "reject_reason", align: "center", templet: function (row) { return common.table.textLeft(row.reject_reason); } }
                ],
                fixed: { project_id: $("[name='project_id']").val(), status: FinishStatus.reject, identified: 1 }
            });
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
            url: "/prj/feedback/update",
            data: data,
            success: function (result) {
                layer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //消息通知
    window.notice = function (ident) {
        if (ident === "feedback") {
            tableInsNofinished.reload();
            if (tableInsFinish) {
                tableInsFinish.reload();
            }
            if (tableInsReject) {
                tableInsReject.reload();
            }
        }
    }

    //对外输出
    exports("main", {});
});