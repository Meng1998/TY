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
    var request = layui.request;
    var $ = layui.$;

    var LAY_PAYMENT_MANAGE = "LAY-payment-manage";

    //项目状态
    var InvoiceStatus = await layui.base.dictionary(setter.dictionary.InvoiceStatus);
    //项目跟进状态
    var CollectStatus = await layui.base.dictionary(setter.dictionary.CollectStatus);

    var toolbarEvent = {
        invoice: function (row) {
            operation(row, "invoice_status", InvoiceStatus.invoiced, InvoiceStatus.invoiced);
        },
        collect: function (row) {
            operation(row, "collect_status", CollectStatus.collected, CollectStatus.collected);
        }
    }

    function operation(row, field, status, value) {
        if (row[field] === status) {
            return;
        }

        var text = "";
        var color = "";
        switch (field) {
            case "invoice_status":
                text = "已开票";
                color = "#0000FF";
                break;
            case "collect_status":
                if (row.invoice_status === InvoiceStatus.notinvoiced) {
                    parentLayer.msg("该付款项未开票！", { icon: 8, anim: 6 });
                    return;
                }
                text = "已收款";
                color = "#FF0000";
                break;
            default:
                return;
        }

        var html = "";

        html += "<body class='layui-layout-body'>";
        html += "<div class='layui-card'>";
        html += "<div class='layui-card-body'>";
        html += "<div class='layui-row'>";
        html += "<div class='layui-text'>";
        html += "<div>"
        html += "<span style='font-size:14px;'>&nbsp;项目名称：</span>";
        html += "<span style='font-size:14px;'>" + $("[name='project_name']").val() + "</span>";
        html += "</div>"
        html += "</div>"
        html += "<div class='layui-text' style='padding-top: 10px;'>";
        html += "<div>"
        html += "<span style='font-size:14px;'>&nbsp;付款条件：</span>";
        html += "<span style='font-size:14px;'>" + row.term + "</span>";
        html += "</div>"
        html += "</div>"
        html += "<div class='layui-text' style='padding-top: 10px;'>";
        html += "<div>"
        html += "<span style='font-size:14px;'>&nbsp;付款金额：</span>";
        html += "<span style='font-size:14px;'>" + row.amount + "</span>";
        html += "</div>"
        html += "</div>"
        html += "</div>"
        html += "<div class='layui-row'>";
        html += "<p align='center'><strong><font size='5' color='" + color + "'>" + text + "</font></strong></p>";
        html += "</div>"
        html += "</div>"
        html += "</div>"
        html += "</body>";

        parentLayer.open({
            type: 1,
            title: "合同收款",
            content: html,
            area: ["500px", "229px"],
            btn: ["确定", "取消"],
            yes: function (index, layero) {
                request.post({
                    url: "/prj/payment/update",
                    method: "post",
                    data: {
                        id: row.id,
                        contract_id: row.contract_id,
                        amount: parseInt(row.amount),
                        [field]: value
                    },
                    success: function () {
                        parentLayer.msg("数据修改成功！", { icon: 1 });
                        parentLayer.close(index);
                        tableIns.reload();
                    }
                })
            }
        });
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PAYMENT_MANAGE,
        url: "/prj/payment/list",
        toolbarEvent: toolbarEvent,
        height: "full-50",
        page: false,
        row: false,
        totalRow: true,
        cols: [
            { type: "numbers" },
            { title: "付款条件", field: "term", align: "center", totalRowText: "合计", templet: function (row) { return common.table.textLeft(row.term); } },
            { title: "付款金额", field: "amount", align: "center", width: 100, totalRow: true },
            { title: "开票状态", field: "invoice_status", align: "center", width: 90, event: "invoice", templet: function (row) { return InvoiceStatus.Formatter(row.invoice_status); } },
            { title: "付款状态", field: "collect_status", align: "center", width: 90, event: "collect", templet: function (row) { return CollectStatus.Formatter(row.collect_status); } }
        ],
        fixed: { contract_id: $("[name='contract_id']").val() }
    });

    //对外输出
    exports("main", {});
});