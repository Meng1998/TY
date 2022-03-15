"use script";

/**
 * @description 登录模块
 */
layui.extend({
    base: "middleware/base",
}).define(["base", "form"], function (exports) {

    var form = layui.form;
    var verify = layui.verify;
    var request = layui.request;
    var base = layui.base;
    var util = layui.util;
    var $ = layui.$;

    var ident = util.guid();

    function captcha() {
        request.post({
            url: "/getCaptcha",
            data: { ident: ident },
            loading: false,
            success: function (data) {
                $("input[name='captcha_code']").val("");
                $(".layadmin-user-login-codeimg").html(data.img);
            }
        });
    }

    !function () {
        //本地缓存
        var local = layui.data("local");

        if (local.user && local.user.remember) {
            form.val("LAY-user-login-form", local.user);
        }

        $("[name='user_pwd'],[name='captcha_code'],[name='user_name']").keydown(function (e) {
            if (e.keyCode === 13) {
                $("button[lay-filter='LAY-user-login-submit']").trigger("click");
            }
        });

        $("input[name='captcha_ident']").val(ident);

        //更换图形验证码
        $("body").on("click", ".layadmin-user-login-codeimg", function () {
            captcha();
        });
        captcha();

        //忘记密码
        $("body").on("click", ".layadmin-user-login-forget", function () {
            layer.alert("忘记密码请联系<font color='#f00'>行政人事部</font>。", {
                title: "忘记密码"
            });
        });
    }();

    //表单提交事件
    form.on('submit(LAY-user-login-submit)', function (obj) {
        var that = this;
        var field = obj.field;

        var verifyData = util.clone(field, ["remember", "captcha_ident"]);
        //非空验证

        if (!verify.execute(verifyData)) {
            return;
        }

        //服务请求
        request.post({
            url: "/sys/user/login",
            data: field,
            beforeSend: function () {
                $(that).text("正在登录，请稍后……");
            },
            success: function (result) {
                var user = result;
                var rememberCheckbox = $("input[name='remember']");
                if (rememberCheckbox[0].checked) {
                    //本地存储
                    layui.data("local", { key: "user", value: { remember: true, user_name: user.user_name, user_pwd: user.user_pwd } });
                } else {
                    //删除存储
                    layui.data("local", { key: "user", remove: true });
                }
                //浏览器存储
                layui.sessionData("session", { key: "user", value: user });
                //页面跳转
                base.page.href("index");
            },
            error: function (result) {
                var code = result.code;
                switch (code) {
                    case 501:
                        $("input[name='captcha_code']").focus();
                        layer.tips("  验证码有误，请重新输入！  ", "input[name='captcha_code", {
                            tips: [1, '#009688'],
                            time: 2000
                        });
                        //重新加载验证码
                        captcha();
                        break;
                    default:
                        $("input[name='user_name']").focus();
                        layer.tips("  用户名或密码不正确！  ", "input[name='user_name", {
                            tips: [1, '#009688'],
                            time: 2000
                        });                       
                        break;
                }
            },
            complete: function () {
                $(that).text("登 录");
            }
        });
    });

    //对外输出
    exports("main", {});
});