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

    var LAY_INFO_MANAGE = "LAY-custom-manage";

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_INFO_MANAGE,
        url: "/cus/info/list",
        cols: [
            { type: "numbers" },
            { title: "客户名称", field: "custom_name", align: "center", width: 300 },
            { title: "客户地址", field: "custom_address", align: "center", width: 400, templet: function (row) { return common.table.textLeft(row.custom_address); } },
            { title: "所在位置", align: "center", width: 220, templet: function (row) { return common.formatRegion(row) } }
        ]
    });

    //监听搜索
    form.on("submit(LAY-custom-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-custom-reset)", function (data) {
        tableIns.reset(data);
    });

    /**
     * 提交数据
     */
    window.select = function (callback) {
        callback(tableIns.selected);
    }

    //对外输出
    exports("main", {});
});