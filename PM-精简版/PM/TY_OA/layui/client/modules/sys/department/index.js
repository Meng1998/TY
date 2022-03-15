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

    var LAY_DEPARTMENT_MANAGE = "LAY-department-manage";

    var toolbarEvent = {
        add: function () {
            openForm();
        },
        delete: function (row) {
            operation(row);
        },
        edit: function (row) {
            if (row) {
                openForm(row.id);
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    function openForm(id) {
        layer.open({
            type: 2,
            title: "部门信息",
            content: "form.html",
            area: ["400px", "452px"],
            btn: ["确定", "取消"],
            success: function (layero, index) {
                var body = layer.getChildFrame("body", index);
                if (id) {
                    body.find("[name='id']").val(id);
                }
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.submit(function (msg) {
                    layer.msg(msg, { icon: 1 });
                    layer.close(index);
                    treeTableIns.reload();
                });
            }
        });
    }

    function operation(row) {
        if (row) {
            layer.confirm("是否删除部门：" + row.dept_name, {
                title: "提示"
            }, function () {
                request.post({
                    url: "/sys/department/delete",
                    data: { id: row.id },
                    success: function (data) {
                        treeTableIns.reload();
                        layer.close(layer.index);
                        layer.msg("数据删除成功", { icon: 1 });
                    }
                });
            });
        } else {
            layer.msg("请选择数据！", { icon: 8 });
        }
    }

    var treeTableIns = treeTable.load({
        elem: LAY_DEPARTMENT_MANAGE,
        url: "/sys/department/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "部门名称", field: "dept_name", align: "left", halign: "center", width: 250 },
            { title: "部门负责人", field: "leader_name", align: "center", width: 120 },
            { title: "排序号", field: "order", align: "center", width: 60 },
            { title: "备注", field: "remark", align: "left", width: 400 },
            { title: "操作", width: 120, align: "center", toolbar: "#tool" }
        ]
    });

    //监听重置
    form.on("submit(LAY-department-search)", function (data) {
        treeTableIns.filterData(data.field.dept_name);
    });

    form.on("submit(LAY-department-reset)", function (data) {
        treeTableIns.clearFilter();
    });

    //对外输出
    exports("main", {});
});