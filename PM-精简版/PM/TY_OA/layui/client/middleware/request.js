"use script";

/**
 * request请求操作
 */
layui.define(function (exports) {

    var util = layui.util;
    var setter = layui.setter;

    var $ = layui.$;

    // var API_URL = "";//API服务地址
    // if (setter.uri.debug) {
    //     API_URL = setter.uri.DEV.api;
    // } else {
    //     API_URL = setter.uri.PRD.api;
    // }

    var API_URL = setter.uri[setter.uri.environment].api;

    //request请求方法
    var request = {
        get: function (settings) {//get
            settings.method = "get";
            return this.ajax(settings);
        },
        post: function (settings) {//post
            settings.method = "post";
            return this.ajax(settings);
        },
        ajax: function (settings) {//ajax
            //回调方法
            var callback = {
                beforeSend: settings.beforeSend,
                success: settings.success,
                error: settings.error,
                complete: settings.complete
            }

            var attribute = {
                loading: settings.loading
            }

            var options = this.settings(settings);

            $.extend(true, settings, options);
            var _layer = settings.layer ? settings.layer : layer;

            //请求之前
            settings.beforeSend = function () {
                if (util.isEmpty(attribute.loading) || attribute.loading === true) {
                    //显示加载动画
                    layui.base.loading(1, _layer);
                }
                if (callback.beforeSend) {
                    callback.beforeSend();
                }
            }

            //请求成功
            settings.success = function (result) {
                request.resHandle(result, callback);
            }

            //请求错误
            settings.error = function (e) {
                _layer.msg("服务请求失败！错误代码：" + e.status, { icon: 2 });
            }

            //请求完成
            settings.complete = function () {
                if (callback.complete) {
                    callback.complete();
                }
                //关闭加载
                _layer.closeAll("loading");
            }

            if (settings) {
                //显示加载层
                return $.ajax(settings);
            }
        },
        when: function (options) {//多个ajax请求
            //显示加载动画
            layui.base.loading(1, layer);
            var ajaxList = [];
            for (let i = 0; i < options.deferreds.length; i++) {
                var deferred = options.deferreds[i];
                deferred.method = (deferred.data) ? "post" : (deferred.method ? deferred.method : "get");
                ajaxList.push(this.ajax(deferred));
            }
            $.when.apply(null, ajaxList).then(function (result) {
                if (layui.util.isObject(result)) {
                    request.resHandle(result, options);
                } else if (layui.util.isArray(result)) {
                    var data = {};
                    for (var i = 0; i < arguments.length; i++) {
                        data[options.deferreds[i].name] = request.resHandle(arguments[i][0]);
                    }
                    if (options && options.success) {
                        options.success(data);
                    }
                }
                //关闭加载
                //layer.closeAll("loading");
            });
        },
        /**
         * 设置ajax参数
         * @param {object} opt 传入参数
         */
        settings: function (opt) {
            //是否启用登录超时，登录页不需要超时验证
            if (setter.loginTimeout && window.location.pathname !== "/client/view/login.html") {
                //操作验证
                var current = Math.floor(Date.now() / 1000);
                var overtime = layui.sessionData("session").overtime;
                if ((current - overtime) > setter.loginTimeout) {
                    //超过10分钟未操作，退出系统
                    layer.alert("系统操作超时，请重新登录!", function () {
                        //记录调用时间
                        layui.sessionData("session", {
                            key: "overtime",
                            value: Math.floor(Date.now() / 1000)
                        });
                        //返回登录页面
                        layui.base.logout();
                    });
                    return null;
                }

                //记录调用时间
                layui.sessionData("session", {
                    key: "overtime",
                    value: Math.floor(Date.now() / 1000)
                });
            }

            var access_token = this.getToken();

            return {
                // url: API_URL + opt.url + "?version=" + (new Date()).format("yyyyMMddhhmm"),
                url: layui.base.API_URL(opt.url),
                method: opt.method,
                data: opt.data,
                dataType: opt.dataType ? opt.dataType : "json",
                headers: {
                    Authorization: "application/json",
                    token: access_token,
                    user: (layui.sessionData("session").user) ? layui.sessionData("session").user.user_name : ""
                }
            };
        },
        /**
         * 获取token
         */
        getToken: function () {
            if (!setter.token) {
                return "";
            }
            var token = layui.sessionData("session").token
            if (!token) {
                //获取公钥
                var settings = {
                    url: API_URL + "/getPublicKey",
                    method: "get"
                }
                $.ajax(settings).done(function (result) {
                    if (result.code === 0) {
                        //获取Token
                        var settings = {
                            url: API_URL + "/getToken",
                            method: "post",
                            data: {
                                secret: setter.secret,
                                publicKey: result.data.public_key//公钥
                            }
                        }
                        $.ajax(settings).done(function (result) {
                            if (result.code === 0) {
                                layui.sessionData("session", {
                                    key: "token",
                                    value: result.data.token
                                });
                            }
                        });
                    }
                });
            }
            return token;
        },
        /**
         * 返回结果处理
         */
        resHandle: function (result, callback) {
            var data = null;
            layui.base.resHandle({
                result: result,
                success: function (result) {
                    data = result;
                    if (callback && callback.success) {
                        callback.success(result);
                    }
                },
                error: function (result) {
                    if (callback && callback.error) {
                        callback.error(result);
                    }
                }
            });
            return data;
        }
    }

    exports("request", request);
});