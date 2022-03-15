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
    var form = layui.form;
    var $ = layui.$;

    var LAY_NOTICE_CATEGORY = "LAY-notice-category";
    var LAY_NOTICE_CONFIG = "LAY-notice-config";

    var toolbarEvent = {
        category_add: function () {
            common.openForm({
                title: "消息通知类别",
                content: "category_form.html",
                area: ["450px", "399px"],
                yes: function () {
                    tableInsCategory.reload();
                }
            });
        },
        category_delete: function (row) {
            common.operation({
                url: "/work/notice_category/delete",
                data: { id: row.id },
                success: function () {
                    tableInsCategory.reload();
                    tableInsConfig.reload();
                }
            }, row, {
                prompt: "是否删除消息通知类别：<font color='#0000FF' style='cursor:pointer'>" + row.category_name + "</font>？",
                success: "数据删除成功！"
            });
        },
        category_edit: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "消息通知类别",
                    content: "category_form.html",
                    area: ["450px", "399px"],
                    row: row,
                    fields: ["id"],
                    yes: function () {
                        tableInsCategory.reload();
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        config_add: function (row) {
            if (!tableInsCategory.selected) {
                layer.msg("请选择消息通知类型", { icon: 8 });
                return;
            }
            common.openForm({
                title: "消息通知类型",
                content: "config_form.html",
                area: ["450px", "777px"],
                fields: [{ dom: "category_id", value: tableInsCategory.selected.id }, { dom: "types", value: tableInsCategory.selected.types }],
                yes: function () {
                    tableInsConfig.reload();
                }
            });
        },
        config_delete: function (row) {
            common.operation({
                url: "/work/notice_config/delete",
                data: { id: row.id },
                success: function () {
                    tableInsConfig.reload();
                }
            }, row, {
                prompt: "是否删除消息通知类型：<font color='#0000FF' style='cursor:pointer'>" + row.title + "</font>？",
                success: "数据删除成功！"
            });
        },
        config_edit: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "消息通知类型",
                    content: "config_form.html",
                    area: ["450px", "777px"],
                    row: row,
                    fields: ["id", { dom: "types", value: tableInsCategory.selected.types }],
                    yes: function () {
                        tableInsConfig.reload();
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        config_user: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "消息通知类型",
                    content: "user.html",
                    area: ["600px", "725px"],
                    row: row,
                    fields: [{ dom: "notice_id", value: row.id }, { dom: "notice_title", value: row.title }, { dom: "ident", value: row.ident }],
                    yes: function () {
                        tableInsConfig.reload();
                        $("#notice_user").empty();
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        }
    }

    var tableInsCategory = table.load({
        elem: LAY_NOTICE_CATEGORY,
        url: "/work/notice_category/list",
        toolbar: "#category-toolbar",
        toolbarEvent: toolbarEvent,
        defaultToolbar: [],
        height: "full-50",
        clickClass: "layui-table-selected",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "消息通知类别名称", field: "category_name", align: "left" }
        ],
        rowClick: function (data) {
            $("#notice_user").empty();
            tableInsConfig.reload({
                where: {
                    category_id: data.id
                }
            });
        }
    });

    var tableInsConfig = table.load({
        elem: LAY_NOTICE_CONFIG,
        url: "/work/notice_config/list",
        toolbar: "#config-toolbar",
        toolbarEvent: toolbarEvent,
        height: "full-408",
        defaultToolbar: [],
        page: false,
        cols: [
            { type: "numbers" },
            { title: "消息通知标识", field: "ident", align: "center", width: 200, templet: function (row) { return common.table.batch(row.ident, ["textLeft", "textBlue"]); } },
            { title: "接口地址", field: "controller_routor", align: "center", width: 170, templet: function (row) { return common.table.textLeft(row.controller_routor); } },
            { title: "接口名称", field: "controller_name", align: "center", width: 130, templet: function (row) { return common.table.textLeft(row.controller_name); } },
            { title: "类型标识", field: "type", align: "center", width: 90 },
            { title: "标题", field: "title", align: "center", width: 150 },
            { title: "是否存库", align: "center", width: 95, toolbar: "#storage-tool" },
            { title: "内容描述", field: "describe", align: "center" },
            { title: "参数类型", field: "params_type", align: "center", width: 90 },
        ],
        fixed: { category_id: "-1" },
        rowClick: function (data) {
            request.post({
                url: "/work/notice_user/list",
                data: { notice_id: data.id },
                success: function (data) {
                    $("#notice_user").empty();
                    for (let i = 0; i < data.list.length; i++) {
                        const item = data.list[i];
                        $("#notice_user").append(addUserList(item));
                    }
                }
            });
        }
    });

    function addUserList(user) {
        var templet = "";
        templet += "<div class='layui-col-sm3'>";
        templet += "<div class='data-group'>";
        templet += "<div class='layui-row layui-col-space15'>";
        templet += "<div class='layui-col-sm3'>";
        if (user.head_img) {
            templet += "<img class='data-header' src='" + user.head_img + "' />";
        } else {
            templet += "<img class='data-header' src='../../../img/head.png' />";
        }
        templet += "</div>";
        templet += "<div class='layui-col-sm9'>";
        templet += "<div class='layui-row layui-col-space15' style='height: 64px; line-height: 64px;'>";
        templet += "<div class='layui-col-sm12'>";
        templet += "<span class='layui-name-label'>" + user.user_name + "</span>";
        templet += "</div>";
        templet += "<div class='layui-col-sm12'>";
        templet += "<span class='layui-role-label'>" + user.user_role + "</span>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        return templet;
    }

    //监听分配操作
    form.on('switch(storage)', function (obj) {
        var data = {
            id: obj.value,
            storage: obj.elem.checked ? 1 : 0
        }

        request.post({
            url: "/work/notice_config/update",
            data: data,
            success: function (result) {
                layer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //对外输出
    exports("main", {});
});