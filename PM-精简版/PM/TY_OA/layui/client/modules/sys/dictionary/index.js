"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], function (exports) {

    var table = layui.table;
    var request = layui.request;
    var common = layui.common;
    var $ = layui.$;

    var LAY_DICTIONARY_PARENT = "LAY-dictionary-parent";
    var LAY_DICTIONARY_CHILD = "LAY-dictionary-child";

    var toolbarEvent = {
        add: function (row, index, config) {
            openForm(config);
        },
        delete: function (row) {
            operation(row);
        },
        edit: function (row, index, config) {
            if (row) {
                openForm(config, row.id);
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    function openForm(config, id) {
        var tableIns = null;
        var pid = "";
        switch (config.id) {
            case "LAY-dictionary-parent":
                $("[name='pid'").val("0");
                tableIns = tableInsParent;
                break;
            case "LAY-dictionary-child":
                if (tableInsParent.selected) {
                    tableIns = tableInsChild;
                    pid = tableInsParent.selected.id;
                } else {
                    layer.msg("请选择字典类型", { icon: 8 });
                    return;
                }
                break;
        }

        var height = "558px";
        if (id) {
            height = "611px";
        }

        layer.open({
            type: 2,
            title: "字典信息",
            content: "form.html",
            area: ["400px", height],
            btn: ["确定", "取消"],
            success: function (layero, index) {
                var body = layer.getChildFrame("body", index);
                if (id) {
                    body.find("[name='id']").val(id);
                    body.find(".item-id").show();
                }
                if (pid) {
                    body.find("[name='pid']").val(pid);
                }
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.submit(function (msg) {
                    layer.msg(msg, { icon: 1 });
                    layer.close(index);
                    tableIns.reload();
                });
            }
        });
    }

    function operation(row) {
        if (row) {
            layer.confirm("是否删除字典：" + row.dic_name, {
                title: "提示"
            }, function () {
                request.post({
                    url: "/sys/dictionary/delete",
                    data: { id: row.id },
                    success: function (data) {
                        tableInsParent.reload();
                        tableInsChild.reload();
                        layer.close(layer.index);
                        layer.msg("数据删除成功");
                    }
                });
            });
        } else {
            layer.msg("请选择数据！", { icon: 8 });
        }
    }

    var tableInsParent = table.load({
        elem: LAY_DICTIONARY_PARENT,
        url: "/sys/dictionary/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        defaultToolbar: [],
        clickClass: "layui-table-selected",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "字典名称", field: "dic_name", align: "left" }
        ],
        height: "full-50",
        fixed: { pid: "0" },
        rowClick: function (data) {
            tableInsChild.reload({
                where: {
                    pid: data.id
                }
            });
        }
    });

    var tableInsChild = table.load({
        elem: LAY_DICTIONARY_CHILD,
        url: "/sys/dictionary/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        defaultToolbar: [],
        page: false,
        cols: [
            { type: "numbers" },
            { title: "字典名称", field: "dic_name", align: "center", width: 200, templet: function (row) { return row.style ? row.style.replace("{dic}", row.dic_name) : row.dic_name; } },
            { title: "字典标识", field: "dic_identity", align: "center", width: 200 },
            { title: "业务数据", field: "op_value", align: "center", width: 200 },
            { title: "分组名称", field: "group", align: "center", width: 120 },
            { title: "排序号", field: "order", align: "center", width: 90 },
            { title: "备注", field: "remark", align: "center", templet: function (row) { return common.table.textLeft(row.remark); } }
        ],
        height: "full-50",
        fixed: { pid: "-1" }
    });

    //对外输出
    exports("main", {});
});