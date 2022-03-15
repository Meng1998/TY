"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "upload", "form"], async function (exports) {

    var setter = layui.setter;
    var common = layui.common;
    var form = layui.form;
    var request = layui.request;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    //客户角色类型
    var RoleType = await layui.base.dictionary(setter.dictionary.RoleType);
    RoleType.render({ elem: "[name='contacts_role']" });

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/cus/contacts",
            data: { id: id },
            success: function (data) {
                form.val(LAY_FORM, data);
            }
        });
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id", "county", "county_name"],
            url: {
                update: "/cus/contacts/update",
                create: "/cus/contacts/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});