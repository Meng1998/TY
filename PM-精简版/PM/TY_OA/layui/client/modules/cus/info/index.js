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
    var request = layui.request;
    var form = layui.form;

    var LAY_INFO_MANAGE = "LAY-info-manage";

    var toolbarEvent = {
        add: function () {
            common.openForm({
                title: "客户信息",
                content: "form.html",
                area: ["550px", "493px"],
                yes: function () {
                    tableIns.reload();
                }
            })
        },
        edit: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "客户信息",
                    content: "form.html",
                    area: ["550px", "493px"],
                    row: row,
                    fields: ["id"],
                    yes: function () {
                        tableIns.reload();
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        delete: function (row) {
            common.operation({
                url: "/cus/info/delete",
                data: { id: row.id },
                success: function (data) {
                    tableIns.reload();
                }
            }, row, {
                prompt: "是否删除客户：<font color='#0000FF' style='cursor:pointer'>" + row.custom_name + "</font>？",
                success: "数据删除成功！"
            });
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_INFO_MANAGE,
        url: "/cus/info/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "客户名称", field: "custom_name", align: "center", width: 300 },
            { title: "客户地址", field: "custom_address", align: "left", width: 400 },
            { title: "所在位置", align: "center", width: 220, templet: function (row) { return common.formatRegion(row) } },
            { title: "备注", field: "remark", align: "center", templet: function (row) { return common.table.textLeft(row.remark); } },
            { title: "操作", width: 120, align: "center", toolbar: "#tool" }
        ]
    });

    //监听搜索
    form.on("submit(LAY-info-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-info-reset)", function (data) {
        tableIns.reset(data);
    });

    //对外输出
    exports("main", {});
});