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
    var form = layui.form;

    var LAY_CONTRACT_MANAGE = "LAY-contract-manage";

    var toolbarEvent = {
        add: function () {
            common.openForm({
                title: "选择项目",
                content: "project.html",
                area: ["1200px", "764px"],
                yes: function (data) {
                    common.openForm({
                        title: "添加合同：" + data.project_name,
                        content: "form.html",
                        area: ["1400px", "682px"],
                        fields: [
                            { dom: "project_id", value: data.id },
                            { dom: "project_code", value: data.project_code },
                            { dom: "project_name", value: data.project_name },
                            { dom: "custom_id", value: data.custom_id },
                            { dom: "custom_name", value: data.custom_name }
                        ]
                    });
                }
            });
        },
        payment: function (row) {
            if (row) {
                common.openForm({
                    title: "合同收款" + row.project_name,
                    content: "payment.html",
                    area: ["800px", "464px"],
                    fields: [{ dom: "contract_id", value: row.id }, { dom: "project_name", value: row.project_name }]
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
        elem: LAY_CONTRACT_MANAGE,
        url: "/prj/contract/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center", width: 250 },
            { title: "甲方名称", field: "custom_name", align: "center", width: 250 },
            { title: "签订时间", field: "sign_time", align: "center", width: 110 },
            { title: "收款进度 (备注：<font color='#33CCFF'>▇▇▇▇ </font>已开票 <font color='#00FF66'>▇▇▇▇ </font>已收款)", field: "null", align: "center", templet: function (row) { return progress(row); } },
            { title: "待收款", field: "receivable", align: "center", width: 100 },
            { title: "已收款", field: "paid", align: "center", width: 100 },
            { title: "交货期", field: "delivery_time", align: "center", width: 110 },
            { title: "操作", width: 100, align: "center", fixed: "right", toolbar: "#tool" }
        ]
    });

    //进度条
    function progress(row) {
        var html = "";
        html += "<div style='height: 28px;border:solid #000066;border-width:0px 0px 0px 1px;color:#666'>"
        var total = 0;
        for (let i = 0; i < row.payments.length; i++) {
            const payment = row.payments[i];
            var title = "付款条件：" + payment.term + "&#13;";

            var scale = parseInt(parseFloat((payment.amount / row.amount).toFixed(2)) * 100);
            if (i !== row.payments.length - 1) {
                total += scale;
            } else {
                scale = 100 - total
            }
            var status = "未开票";
            var color = "#e7f1ff";
            if (payment.invoice_status === "1") {
                color = "#33CCFF";
                status = "已开票";
            }
            if (payment.collect_status === "1") {
                color = "#00FF66";
                status = "已付款";
            }
            title += "付款比例：" + scale + "%&#13;";
            title += "付款金额：" + payment.amount + "&#13;";
            title += "当前进度：" + status;
            var amount = payment.amount;
            if (scale < 10) {
                amount = "";
            }
            html += "<div title='" + title + "' style='cursor:pointer;width:" + scale + "%;height: 28px;background: " + color + ";float:left;border:solid #000066;border-width:1px 1px 1px 0px;line-height:28px;'>" + amount + "</div>";
        }
        html += "</div>";
        return html;
    }

    //监听搜索
    form.on("submit(LAY-contract-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-contract-reset)", function (data) {
        tableIns.reset(data);
    });

    //消息通知
    window.notice = function (ident) {
        if (ident === "contract") {
            tableIns.reload();
        }
    }

    //对外输出
    exports("main", {});
});