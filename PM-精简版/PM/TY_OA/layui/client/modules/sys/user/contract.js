"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form", "laydate"], function (exports) {

    var form = layui.form;
    var laydate = layui.laydate;
    var request = layui.request;
    var verify = layui.verify;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    laydate.render({
        elem: "input[name='contract_sign']",
        done: function (value, date) {
            //更新结束日期的最小日期
            contract_expire.config.min = lay.extend({}, date, {
                month: date.month - 1
            });

            //自动弹出结束日期的选择器
            contract_expire.config.elem[0].focus();
        }
    });

    var contract_expire = laydate.render({
        elem: "input[name='contract_expire']"
    });

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/sys/user",
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
        var field = form.val(LAY_FORM);

        //非空验证
        if (!verify.execute(field)) {
            return;
        }

        request.post({
            url: "/sys/user/update",
            data: field,
            success: function (data) {
                if (callback) {
                    callback("数据修改成功");
                }
            }
        });
    }

    //对外输出
    exports("main", {});
});