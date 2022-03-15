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

    var LAY_CONTACTS_MANAGE = "LAY-contacts-manage";

    //客户角色类型
    var RoleType = await layui.base.dictionary(setter.dictionary.RoleType);

    var tableIns = table.load({
        elem: LAY_CONTACTS_MANAGE,
        url: "/cus/contacts/list",
        cols: [
            { type: "numbers" },
            { title: "联系人姓名", field: "contacts_name", align: "center", width: 120 },
            { title: "联系电话", field: "contacts_tel", align: "center", width: 150 },
            { title: "人员角色", field: "contacts_role", align: "center", width: 120, templet: function (row) { return RoleType.Formatter(row.contacts_role); } }
        ],
        fixed: { custom_id: custom_id }
    });

    //监听搜索
    form.on("submit(LAY-contacts-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-contacts-reset)", function (data) {
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