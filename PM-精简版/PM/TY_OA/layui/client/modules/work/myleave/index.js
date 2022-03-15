"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form", "laydate"], async function (exports) {

    var table = layui.table;
    var laydate = layui.laydate;
    var setter = layui.setter;
    var request = layui.request;
    var common = layui.common;
    var form = layui.form;

    var LAY_LEAVE_MANAGE = "LAY-leave-manage";
    var user = layui.sessionData("session").user;

    //人员请假类型
    var LeaveType = await layui.base.dictionary(setter.dictionary.LeaveType);
    //请假审批状态
    var ApprovalStatus = await layui.base.dictionary(setter.dictionary.ApprovalStatus);

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

    var toolbarEvent = {
        add: function () {
            common.openForm({
                title: "新建请假",
                content: "add.html",
                area: ["600px", "407px"],
                fields: [{ dom: "user_id", value: user.id }, { dom: "user_name", value: user.full_name }],
                yes: function (index, layero) {
                    tableIns.reload();
                }
            });
        },
        delete: function (row) {
            common.operation({
                url: "/work/leave/delete",
                data: { id: row.id },
                verify: function () {
                    return (row.approval === ApprovalStatus.submit);
                },
                success: function () {
                    tableIns.reload();
                }
            }, row, {
                prompt: "是否删除请假信息？",
                success: "数据删除成功！"
            });
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_LEAVE_MANAGE,
        url: "/work/leave/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "提交时间", field: "create_time", align: "center", width: 200 },
            { title: "起始时间", field: "start_time", align: "center", width: 200, templet: function (row) { return row.start_time.UTCToBeiJing(); } },
            { title: "结束时间", field: "end_time", align: "center", width: 200, templet: function (row) { return row.end_time.UTCToBeiJing(); } },
            { title: "请假类型", field: "type", align: "center", width: 100, templet: function (row) { return LeaveType.Formatter(row.type); } },
            { title: "请假原因", field: "excues", align: "center", templet: function (row) { return common.table.textLeft(row.excues); } },
            { title: "审批状态", field: "approval", align: "center", width: 100, templet: function (row) { return ApprovalStatus.Formatter(row.approval); } },
            { title: "审批人", field: "approver_name", align: "center", width: 100 },
            { title: "操作", width: 70, align: "center", toolbar: "#tool" }
        ],
        fixed: { user_id: user.id }
    });

    //监听搜索
    form.on("submit(LAY-leave-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-leave-reset)", function (data) {
        tableIns.reset(data);
    });

    //对外输出
    exports("main", {});
});