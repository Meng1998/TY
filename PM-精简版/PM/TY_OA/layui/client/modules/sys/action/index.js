"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeTableEx: "middleware/plugin/treeTable",//树列表扩展
}).define(["base", "treeTableEx"], async function (exports) {

    //加载下拉树扩展
    layui.use("treeTableEx");

    var treeTable = layui.treeTable;
    var request = layui.request;
    var form = layui.form;
    var setter = layui.setter;

    var LAY_ACTION_MANAGE = "LAY-action-manage";

    //功能菜单启用状态
    var EnableStatus = await layui.base.dictionary(setter.dictionary.EnableStatus);

    var toolbarEvent = {
        add: function () {
            openForm({});
        },
        delete: function (row) {
            operation(row);
        },
        edit: function (row) {
            if (row) {
                openForm({
                    id: row.id,
                    success: function (body, options) {
                        body.find("[name='id']").val(options.id);
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        authorise: function (row) {
            if (row) {
                openForm({
                    id: row.id,
                    title: row.action_name,
                    content: "authorise.html",
                    area: ["600px", "700px"],
                    btn: ["关闭"],
                    type: "authorise",
                    success: function (body, options) {
                        body.find("[name='action_id']").val(options.id);
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
            title: options.title ? options.title : "功能信息",
            content: options.content ? options.content : "form.html",
            area: options.area ? options.area : ["400px", "664px"],
            btn: options.btn ? options.btn : ["确定", "取消"],
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.parentLayer = layer;
                if (options.id) {
                    var body = layer.getChildFrame("body", index);
                    if (options.success) {
                        options.success(body, options);
                    }
                }
            },
            yes: function (index, layero) {
                if (options.type !== "authorise") {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.submit(function (msg) {
                        layer.msg(msg, { icon: 1 });
                        layer.close(index);
                        treeTableIns.reload();
                    });
                } else {
                    layer.close(index);
                }
            }
        });
    }

    function operation(row) {
        if (row) {
            layer.confirm("是否删除功能：" + row.action_name, {
                title: "提示"
            }, function () {
                request.post({
                    url: "/sys/action/delete",
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
        elem: LAY_ACTION_MANAGE,
        url: "/sys/action/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        tree: {
            getIcon: function (d) {  // 自定义图标
                // d是当前行的数据
                if (d.children) {  // 判断是否有子集
                    return d.iconCls ? '<i class="' + d.iconCls + ' fa-fw"></i>' : '<i class="ew-tree-icon layui-icon layui-icon-layer"></i>';
                } else {
                    return d.iconCls ? '<i class="' + d.iconCls + ' fa-fw"></i>' : "";
                }
            }
        },
        cols: [
            { type: "numbers" },
            { title: "功能名称", field: "name", align: "left", width: 210 },
            { title: "功能标题", field: "action_title", align: "center", width: 150 },
            { title: "功能目标", field: "action_intent", align: "left", width: 210, templet: function (row) { return "<font color='#0000FF' style='cursor:pointer'>" + row.action_intent + "</font>"; } },
            { title: "图标", field: "action_icon", align: "left", width: 230 },
            { title: "启用状态", align: "center", width: 100, toolbar: "#enable-tool" },
            { title: "排序号", field: "order", align: "center", width: 40 },
            { title: "功能标识", field: "ident", align: "left", width: 120 },
            { title: "备注", field: "remark", align: "left" },
            { title: "操作", width: 200, align: "center", toolbar: "#tool" }
        ]
    });

    //监听分配操作
    form.on('switch(enable)', function (obj) {
        var data = {
            id: obj.value,
            action_enable: obj.elem.checked ? 1 : 0
        }

        noticeRefresh = false;
        request.post({
            url: "/sys/action/update",
            data: data,
            success: function () {
                layer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //监听重置
    form.on("submit(LAY-action-search)", function (data) {
        treeTableIns.filterData(data.field.action_name);
    });

    form.on("submit(LAY-action-reset)", function (data) {
        treeTableIns.clearFilter();
    });

    //对外输出
    exports("main", {});
});