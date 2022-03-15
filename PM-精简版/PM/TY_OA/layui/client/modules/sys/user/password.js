"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], function (exports) {

    var form = layui.form;
    var request = layui.request;
    var verify = layui.verify;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    var user = layui.sessionData("session").user
    $("[name='id']").val(user.id);

    $("[name='new_pwd']").keyup(function () {
        $(this).removeClass("layui-form-danger");
        passwordChangeStatuss($(this).val());
    });
    $("[name='new_pwd']").blur(function () {
        passwordChangeStatuss($(this).val());
    });

    //密码强度判断
    function passwordChangeStatuss(pwd) {
        if (pwd == "" || pwd == null) {
            $(".pwd-item label").attr("class", "layui-btn layui-btn-primary");
        } else {
            var S_level = checkStrong(pwd);
            switch (S_level) {
                case 0:
                    $(".pwd-item label").attr("class", "layui-btn layui-btn-primary");
                case 1:
                    $("#l").attr("class", "layui-btn layui-btn-danger");
                    $("#m").attr("class", "layui-btn layui-btn-primary");
                    $("#h").attr("class", "layui-btn layui-btn-primary");
                    break;
                case 2:
                    $("#l").attr("class", "layui-btn layui-btn-danger");
                    $("#m").attr("class", "layui-btn layui-btn-warm");
                    $("#h").attr("class", "layui-btn layui-btn-primary");
                    break;
                default:
                    $("#l").attr("class", "layui-btn layui-btn-danger");
                    $("#m").attr("class", "layui-btn layui-btn-warm");
                    $("#h").attr("class", "layui-btn");
            }
        }

        //判断输入密码的类型 
        function CharMode(iN) {
            if (iN >= 48 && iN <= 57) //数字 
                return 1;
            if (iN >= 65 && iN <= 90) //大写 
                return 2;
            if (iN >= 97 && iN <= 122) //小写 
                return 4;
            else
                return 8;
        }

        //bitTotal函数 
        //计算密码模式 
        function bitTotal(num) {
            modes = 0;
            for (i = 0; i < 4; i++) {
                if (num & 1) modes++;
                num >>>= 1;
            }
            return modes;
        }

        //返回强度级别 
        function checkStrong(sPW) {
            if (sPW.length <= 8)
                return 0; //密码太短 
            Modes = 0;
            for (i = 0; i < sPW.length; i++) {
                //密码模式 
                Modes |= CharMode(sPW.charCodeAt(i));
            }
            return bitTotal(Modes);
        }
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

        if (field.new_pwd !== field.repeat_pwd) {
            layer.msg("两次密码输入不一致!");
        } else {
            /**
             * 密码强度验证
             */
            if (field.new_pwd.match(/^[\S]{8,16}$/) == null) {
                var selector = $("[name='new_pwd']");
                selector.addClass("layui-form-danger");
                layer.tips("  密码必须8到16位，且不能出现空格!  ", selector, {
                    tips: [1, '#009688'],
                    area: '230px',
                    time: 2000
                });
                $(selector).focus();
                return;
            }

            request.post({
                url: "/sys/user/changePwd",
                data: field,
                success: function (data) {
                    if (callback) {
                        callback("密码修改成功，请重新登录!");
                    }
                },
                error: function () {
                    layer.msg("当前密码不正确!");
                }
            });
        }
    }

    //对外输出
    exports("main", {});
});