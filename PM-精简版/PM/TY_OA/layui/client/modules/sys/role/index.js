"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeTableEx: "middleware/plugin/treeTable",//树列表扩展
}).define(["base", "treeTableEx"], function (exports) {

    //加载下拉树扩展
    layui.use("treeTableEx");

    var form = layui.form;
    var treeTable = layui.treeTable;
    var request = layui.request;
    var common = layui.common;

    var LAY_ROLE_MANAGE = "LAY-role-manage";

    var toolbarEvent = {
        add: function () {
            openForm({
                yes: function () {
                    treeTableIns.reload();
                }
            });
        },
        delete: function (row) {
            operation(row);
        },
        edit: function (row) {
            if (row && row.role) {
                openForm({
                    id: row.id,
                    success: function (body, options) {
                        body.find("[name='id']").val(options.id);
                    },
                    yes: function () {
                        treeTableIns.reload();
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        authorise: function (row) {
            if (row && row.role) {
                openForm({
                    id: row.id,
                    title: "权限分配",
                    content: "authorise.html",
                    area: ["350px", "799px"],
                    success: function (body, options) {
                        body.find("[name='role_id']").val(options.id);
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    function openForm(options) {
        layer.open({
            type: 2,
            title: options.title ? options.title : "角色信息",
            content: options.content ? options.content : "form.html",
            area: options.area ? options.area : ["400px", "452px"],
            btn: ["确定", "取消"],
            success: function (layero, index) {
                if (options.id) {
                    var body = layer.getChildFrame("body", index);
                    if (options.success) {
                        options.success(body, options);
                    }
                }
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.submit(function (msg) {
                    layer.msg(msg, { icon: 1 });
                    layer.close(index);
                    if (options.yes) {
                        options.yes();
                    }
                });
            }
        });
    }

    function operation(row) {
        if (row && row.role) {
            layer.confirm("是否删除角色：" + row.role_name, {
                title: "提示"
            }, function () {
                request.post({
                    url: "/sys/role/delete",
                    data: { id: row.id },
                    success: function (data) {
                        treeTableIns.reload();
                        layer.close(layer.index);
                        layer.msg("数据删除成功");
                    }
                });
            });
        } else {
            layer.msg("请选择数据！", { icon: 8 });
        }
    }

    var treeTableIns = treeTable.load({
        elem: LAY_ROLE_MANAGE,
        url: "/sys/role/rolesRegion",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "角色名称", field: "name", align: "left", width: 350 },
            { title: "排序号", field: "order", align: "center", width: 60 },
            { title: "工作台", field: "workbench", align: "left", width: 250, templet: function (row) { return row.workbench ? "<font color='#0000FF' style='cursor:pointer'>" + row.workbench + "</font>" : ""; } },
            { title: "备注", field: "remark", align: "center", templet: function (row) { return common.table.textLeft(row.remark); } },
            { title: "操作", width: 200, align: "center", toolbar: "#tool" }
        ]
    });

    //监听重置
    form.on("submit(LAY-role-search)", function (data) {
        treeTableIns.filterData(data.field.role_name);
    });

    form.on("submit(LAY-role-reset)", function (data) {
        treeTableIns.clearFilter();
    });

    //对外输出
    exports("main", {});
});