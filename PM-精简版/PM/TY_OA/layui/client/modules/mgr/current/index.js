"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeTableEx: "middleware/plugin/treeTable",//树列表扩展
}).define(["base", "treeTableEx"], async function (exports) {

    //加载下拉树扩展
    layui.use("treeTableEx");

    var treeTable = layui.treeTable;
    var common = layui.common;
    var form = layui.form;
    var setter = layui.setter;

    var LAY_FEEDBACK_MANAGE = "LAY-feedback-manage";

    //项目反馈完成状态
    var FinishStatus = await layui.base.dictionary(setter.dictionary.FinishStatus);
    //项目反馈类型
    var FeedbackType = await layui.base.dictionary(setter.dictionary.FeedbackType);

    var treeTableIns = treeTable.load({
        elem: LAY_FEEDBACK_MANAGE,
        url: "/prj/feedback/feedbackByProject",
        height: "full-50",
        cols: [
            { type: "numbers" },
            { title: "问题反馈", field: "text", align: "left", width: 300, templet: function (row) { if (row.node_type === "project") { return row.text + '<font color="#FF0000"> (' + row.total + ')</font>'; } else { return row.text; } } },
            { title: "内容类型", width: 100, field: "type", align: "center", templet: function (row) { return FeedbackType.Formatter(row.type); } },
            { title: "创建人", width: 70, field: "creater_name", align: "center" },
            { title: "创建时间", width: 170, field: "create_time", align: "center", templet: function (row) { return (row.create_time) ? row.create_time.UTCToBeiJing() : ""; } },
            { title: "被指派人", width: 70, field: "designee_name", align: "center" },
            { title: "预计完成时间", width: 120, field: "estimate_time", align: "center" },
            { title: "指派人", width: 50, field: "assignor_name", align: "center" },
            { title: "问题描述", field: "message", align: "center", templet: function (row) { return (row.message) ? common.table.textLeft(row.message) : ""; } },
        ],
        fixed: {
            status: [FinishStatus.notstarted, FinishStatus.distrib, FinishStatus.inprogress],
        }
    });

    //监听重置
    form.on("submit(LAY-project-search)", function (data) {
        treeTableIns.filterData(data.field.action_name);
    });

    form.on("submit(LAY-project-reset)", function (data) {
        treeTableIns.clearFilter();
    });

    //消息通知
    window.notice = function (ident) {
        if (ident === "feedback") {
            treeTableIns.reload();
        }
    }

    //对外输出
    exports("main", {});
});