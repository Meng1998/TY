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
    var common = layui.common;
    var form = layui.form;

    var LAY_BUSTRIP_MANAGE = "LAY-bustrip-manage";

    //人员出差类型
    var BustripType = await layui.base.dictionary(setter.dictionary.BustripType);
    BustripType.render({ elem: "[name='type']" });

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
        cost: function (row) {
            if (row) {
                var title = "差旅费用：";
                if (row.type === BustripType.customercommun) {
                    title += BustripType.getDic(BustripType.customercommun, "op_value").dic_name;
                } else {
                    title += row.project_name;
                }
                common.openForm({
                    title: title,
                    content: "cost.html",
                    area: ["900px", "700px"],
                    fields: [
                        { dom: "id", value: row.id },
                        { dom: "project_id", value: row.project_id },
                        { dom: "project_name", value: row.project_name },
                        { dom: "title", value: row.title },
                        { dom: "message", value: row.message }
                    ]
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
        elem: LAY_BUSTRIP_MANAGE,
        url: "/work/bustrip/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "外勤人员", field: "user_name", align: "center", width: 110 },
            { title: "外勤事由", field: "excues", align: "center", width: 200, templet: function (row) { return common.table.textLeft(row.excues); } },
            { title: "外勤类型", field: "type", align: "center", width: 100, templet: function (row) { return BustripType.Formatter(row.type); } },
            { title: "起始时间", field: "start_time", align: "center", width: 110 },
            { title: "结束时间", field: "end_time", align: "center", width: 110 },
            { title: "项目名称", field: "project_name", align: "center", width: 280 },
            { title: "所在位置", align: "center", width: 220, templet: function (row) { return common.formatRegion(row) } },
            { title: "当前状态", align: "center", width: 100, templet: function (row) { return row.end_time ? common.table.textBlue("已结束") : common.table.textGreen("出差中"); } },
            { title: "备注", field: "remark", align: "center", templet: function (row) { return common.table.textLeft(row.remark); } },
            { title: "操作", width: 90, align: "center", toolbar: "#tool" }
        ]
    });

    //监听搜索
    form.on("submit(LAY-bustrip-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-bustrip-reset)", function (data) {
        tableIns.reset(data);
    });

    form.render();

    //对外输出
    exports("main", {});
});