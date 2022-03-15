"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], function (exports) {

    var form = layui.form;
    var request = layui.request;
    var common = layui.common;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/work/notice_category",
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
            removeKeys: ["id", "remark"],
            url: {
                update: "/work/notice_category/update",
                create: "/work/notice_category/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});