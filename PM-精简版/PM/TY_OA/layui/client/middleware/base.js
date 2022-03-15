"use script";

/**
 * 基础方法
 */
layui.extend({
    setter: "middleware/setter",//全局配置文件
    utilEx: "middleware/util",//工具扩展
    request: "middleware/request",//请求响应
    verify: "middleware/verify",//表单验证
    common: "middleware/common",//公共方法
    prototypeEx: "middleware/extend"//原生对象扩展
}).define(["setter", "jquery", "utilEx", "verify", "common", "request", "prototypeEx"], function (exports) {

    //加载工具扩展
    layui.use("utilEx");
    //原生对象扩展
    layui.use("prototypeEx");

    var request = layui.request;
    var setter = layui.setter;
    var util = layui.util;
    var $ = layui.$;

    /**
     * 判断用户登录状态
     */
    function isLogin() {
        //判断当前是否已登录
        var user = layui.sessionData("session").user
        if (!user) {
            if (window.location.pathname !== "/client/view/login.html") {
                logout();
            }
            return;
        }
    }

    /**
     * 跳转到登录
     */
    function logout() {
        page.href("login");
    }

    /**
     * 获取token
     */
    function getToken() {
        return request.getToken();
    }

    /**
     * 响应处理
     * @param {object} options 处理参数
     */
    function resHandle(options) {
        switch (options.result.code) {
            case 0:
                options.success(options.result.data);
                break;
            case 403:
                //登录过期
                layui.sessionData("session", {
                    key: "token",
                    remove: true
                });
                getToken();
                break;
            default:
                options.error(options.result);
                break;
        }
    }

    //页面操作方法
    var page = {
        href: function (pageUri) {
            window.location.href = layui.cache.host + "client/view/" + (pageUri.endsWith(".html") ? pageUri : pageUri + ".html") + URL_V();
        }
    };

    /**
     * 显示加载层
     * @param {number} type 加载层类型
     */
    function loading(type, _layer) {
        _layer.load(type ? type : 0);
    }

    /**
     * 获取url地址
     */
    function API_URL(url) {
        return setter.uri[setter.uri.environment].api + url + URL_V();
    }

    /**
     * 缓存处理
     */
    function URL_V() {
        return "?version=" + (new Date()).format("yyyyMMddhhmm");
    }

    /**
     * 获取字典数据
     * @param {string} pid 父字典id
     */
    function dictionary(pid) {
        var promise = new Promise(function (resolve, reject) {
            try {
                request.post({
                    url: "/sys/dictionary/list",
                    data: { pid: pid },
                    success: function (data) {
                        for (let i = 0; i < data.list.length; i++) {
                            const item = data.list[i];
                            data[item.dic_identity] = item.op_value;
                        }
                        //格式化数据
                        data.Formatter = function (op_value, with_style = true) {
                            var dic_name = "";
                            var style = "";
                            for (let i = 0; i < this.list.length; i++) {
                                const dic = this.list[i];
                                if (op_value === dic.op_value) {
                                    dic_name = dic.dic_name;
                                    style = dic.style;
                                    break;
                                }
                            }
                            if (util.isNotEmpty(style) && with_style) {
                                return style.replace("{dic}", dic_name);
                            } else {
                                return dic_name;
                            }
                        }
                        data.getDic = function (value, key) {
                            for (let i = 0; i < this.list.length; i++) {
                                const dic = this.list[i];
                                if (dic[key] === value) {
                                    return dic;
                                }
                            }
                        }
                        data.groupData = function () {
                            var group = [];
                            for (let i = 0; i < this.list.length; i++) {
                                const dic = this.list[i];
                                var ishave = false;
                                for (let j = 0; j < group.length; j++) {
                                    const item = group[j];
                                    if (item.name === dic.group) {
                                        item.data.push(dic);
                                        ishave = true;
                                        break;
                                    }
                                }
                                if (!ishave) {
                                    group.push({
                                        name: dic.group,
                                        data: [dic]
                                    })
                                }
                            }
                            return group;
                        }
                        data.render = function (options) {
                            var form = layui.form;
                            //添加默认项
                            $(options.elem).empty();
                            $(options.elem).append("<option value=''>请选择</option>");
                            for (let i = 0; i < this.list.length; i++) {
                                const dic = this.list[i];
                                $(options.elem).append("<option value='" + dic[options.value ? options.value : "op_value"] + "'>" + dic[options.name ? options.name : "dic_name"] + "</option>");
                            }
                            form.render();
                        }
                        resolve(data);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }

    var base = {
        /**
         * 初始化
         */
        init: function () {
            isLogin();
            getToken();//初始化Token
        },
        logout: function () {
            logout();
        },
        /**
         * 响应处理
         * @param {object} options 返回参数
         */
        resHandle: function (options) {
            resHandle(options)
        },
        page: page,
        loading: function (type, _layer) {
            loading(type, _layer);
        },
        API_URL: function (url) {
            return API_URL(url);
        },
        URL_V: function () {
            return URL_V();
        },
        getToken: function () {
            return getToken();
        },
        dictionary: async function (pid) {
            return await dictionary(pid);
        }
    }

    base.init();

    exports("base", base);
});