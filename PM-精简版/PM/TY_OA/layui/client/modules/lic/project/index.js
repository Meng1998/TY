"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table",//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var form = layui.form;
    var setter = layui.setter;
    var $ = layui.$;

    var LAY_PROJECT_MANAGE = "LAY-project-manage";

    //项目合同状态
    var ContractStatus = await layui.base.dictionary(setter.dictionary.ContractStatus);

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PROJECT_MANAGE,
        url: "/lic/project/list",
        row: false,
        cols: [
            { type: "numbers" },
            { title: "项目编号", field: "project_code", align: "center", width: 140, templet: function (row) { return common.table.textBlue(row.project_code); } },
            { title: "项目名称", field: "project_name", align: "center", width: 320 },
            { title: "客户名称", field: "custom_name", align: "center", width: 250 },
            { title: "合同状态", field: "contract_status", align: "center", width: 100, templet: function (row) { return ContractStatus.Formatter(row.contract_status); } },
            { title: "收款进度 (备注：<font color='#33CCFF'>▇▇▇▇ </font>已开票 <font color='#00FF66'>▇▇▇▇ </font>已收款)", field: "null", align: "center", templet: function (row) { return progress(row); } },
            { title: "授权失效时间", field: "expire_time", align: "center", width: 120 }
        ],
        done: function (instance, options) {
            var that = instance.elem.next();
            options.res.data.forEach(function (item, index) {
                var differ_day = item.expire_time.DifferDay();
                if (differ_day < 15) {
                    var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");
                    tr.addClass("layui-bg-red");
                }
            });
        }
    });

    //进度条
    function progress(row) {
        if (!row.payments) {
            return "";
        }
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
    form.on("submit(LAY-authorize-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-authorize-reset)", function (data) {
        tableIns.reset(data);
    });

    //对外输出
    exports("main", {});
});