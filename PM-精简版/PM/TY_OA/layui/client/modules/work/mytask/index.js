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

    var LAY_FEEDBACK_MANAGE = "LAY-feedback-manage";

    var user = layui.sessionData("session").user;

    //项目反馈完成状态
    var FinishStatus = await layui.base.dictionary(setter.dictionary.FinishStatus);
    window.FinishStatus = FinishStatus;

    var toolbarEvent = {
        inprogress: function (row) {
            if (row) {
                common.operation({
                    url: "/prj/feedback/update",
                    data: {
                        id: row.id,
                        status: FinishStatus.inprogress
                    }
                }, row, {
                    prompt: "开始任务<font color='#0000FF' style='cursor:pointer'>" + row.title + "</font>？",
                    success: "数据已修改!"
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        finished: function (row) {
            if (row) {
                common.operation({
                    url: "/prj/feedback/update",
                    data: {
                        id: row.id,
                        status: FinishStatus.finished
                    }
                }, row, {
                    prompt: "是否完成<font color='#0000FF' style='cursor:pointer'>" + row.title + "</font>？",
                    success: "数据已修改!"
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
        elem: LAY_FEEDBACK_MANAGE,
        url: "/prj/feedback/list",
        height: "full-100",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目名称", width: 250, field: "project_name", align: "center" },
            { title: "内容标题", width: 250, field: "title", align: "center" },
            { title: "创建人", width: 100, field: "creater_name", align: "center" },
            { title: "被指派人", width: 100, field: "designee_name", align: "center" },
            { title: "完成状态", width: 100, field: "status", align: "center", templet: function (row) { return FinishStatus.Formatter(row.status); } },
            { title: "预计完成时间", width: 130, field: "estimate_time", align: "center" },
            { title: "问题描述", field: "message", align: "center", templet: function (row) { return common.table.textLeft(row.message); } },
            { title: "操作", width: 90, align: "center", fixed: "right", toolbar: "#tool" }
        ],
        fixed: { designee_id: user.id }
    });

    //监听搜索
    form.on("submit(LAY-feedback-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-feedback-reset)", function (data) {
        tableIns.reset(data);
    });

    //消息通知
    window.notice = function (ident) {
        if (ident === "feedback") {
            tableIns.reload();
        }
    }

    //对外输出
    exports("main", {});
});