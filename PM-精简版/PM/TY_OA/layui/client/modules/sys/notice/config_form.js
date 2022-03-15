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

    var types = $("[name='types']").val().split(",");
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        $("[name='type']").append("<option value='" + type + "'>" + type + "</option>");
    }
    form.render();

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/work/notice_config",
            data: { id: id },
            success: function (data) {
                form.val(LAY_FORM, data);

                if (data.storage === 1) {
                    $("input[type='checkbox']").attr("checked", "checked");
                    form.render('checkbox');
                }
            }
        });
    }

    form.on('switch(storage)', function (obj) {
        $("[name='storage']").val(obj.elem.checked ? 1 : 0);
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id", "remark"],
            url: {
                update: "/work/notice_config/update",
                create: "/work/notice_config/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});