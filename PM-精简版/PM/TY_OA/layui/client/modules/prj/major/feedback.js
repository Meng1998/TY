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

    /**
    * 初始化数据
    */
    tableInsNofinished = table.load({
        elem: LAY_NOFINISHED_FEEDBACK_MANAGE,
        url: "/prj/feedback/list",
        height: "full-100",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "内容标题", width: 250, field: "title", align: "center" },
            { title: "内容类型", width: 100, field: "type", align: "center", templet: function (row) { return FeedbackType.Formatter(row.type); } },
            { title: "当前状态", width: 100, field: "status", align: "center", event: "status", templet: function (row) { return FinishStatus.Formatter(row.status); } },
            { title: "被指派人", width: 100, field: "designee_name", align: "center" },
            { title: "预计完成时间", width: 130, field: "estimate_time", align: "center" },
            { title: "问题描述", field: "message", align: "center", templet: function (row) { return common.table.textLeft(row.message); } },
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