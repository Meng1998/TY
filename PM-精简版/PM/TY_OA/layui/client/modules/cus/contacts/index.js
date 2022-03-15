"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var setter = layui.setter;
    var form = layui.form;
    var request = layui.request;
    var common = layui.common;

    var LAY_INFO_MANAGE = "LAY-info-manage";
    var LAY_CONTACTS_MANAGE = "LAY-contacts-manage";

    //客户角色类型
    var RoleType = await layui.base.dictionary(setter.dictionary.RoleType);

    var toolbarEvent = {
        add: function () {
            if (tableInsInfo.selected) {
                common.openForm({
                    title: "联系人信息",
                    content: "form.html",
                    area: ["400px", "452px"],
                    fields: [{ dom: "custom_id", value: tableInsInfo.selected.id }, { dom: "custom_name", value: tableInsInfo.selected.custom_name }],
                    yes: function () {
                        tableInsContacts.reload();
                    }
                });
            } else {
                layer.msg("请选择客户!", { icon: 8 });
            }
        },
        edit: function (row) {
            if (row) {
                common.openForm({
                    id: row.id,
                    title: "联系人信息",
                    content: "form.html",
                    area: ["400px", "452px"],
                    row: row,
                    fields: ["id"],
                    yes: function () {
                        tableInsContacts.reload();
                    }
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        delete: function (row) {
            common.operation({
                url: "/cus/contacts/delete",
                data: { id: row.id },
                success: function (data) {
                    tableInsContacts.reload();
                }
            }, row, {
                prompt: "是否删除客户联系人：<font color='#0000FF' style='cursor:pointer'>" + row.contacts_name + "</font>？",
                success: "数据删除成功！"
            });
        }
    }

    /**
    * 初始化数据
    */
    var tableInsInfo = table.load({
        elem: LAY_INFO_MANAGE,
        url: "/cus/info/list",
        clickClass: "layui-table-selected",
        cols: [
            { type: "numbers" },
            { title: "客户名称", field: "custom_name", align: "left" }
        ],
        rowClick: function (data) {
            tableInsContacts.instance.page.curr = 0;
            tableInsContacts.reload({
                where: {
                    custom_id: data.id
                }
            });
        }
    });

    var tableInsContacts = table.load({
        elem: LAY_CONTACTS_MANAGE,
        url: "/cus/contacts/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "联系人姓名", field: "contacts_name", align: "center", width: 110 },
            { title: "联系电话", field: "contacts_tel", align: "center", width: 140 },
            { title: "人员角色", field: "contacts_role", align: "center", width: 100, templet: function (row) { return RoleType.Formatter(row.contacts_role); } },
            { title: "备注", field: "remark", align: "center", templet: function (row) { return common.table.textLeft(row.remark); } },
        ],
        fixed: { custom_id: "-1" }
    });

    //监听搜索
    form.on("submit(LAY-info-search)", function (data) {
        tableInsInfo.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-info-reset)", function (data) {
        tableInsInfo.reset(data);
    });

    //监听搜索
    form.on("submit(LAY-contacts-search)", function (data) {
        tableInsContacts.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-contacts-reset)", function (data) {
        tableInsContacts.reset(data);
    });

    //对外输出
    exports("main", {});
});