/*!
 * jQuery插件扩展
 *
 */
(function (window, jQuery, undefined) {
    "use strict";

    var $ = jQuery;

    $.extend({
        exception: function (callBank, exCallBack) {
            /// <summary>无参数方法异常处理</summary>
            /// <param name="callBank" type="Function">执行函数</param>
            /// <param name="exCallBack" type="Function">异常处理</param>
            /// <returns type="Object">执行结果</returns>

            if (!callBank) {
                return;
            }

            try {
                return execute(callBank);
            } catch (e) {
                return execute(exCallBack, e);
            }

            function execute(fn, e) {
                var result = undefined;
                if (fn && $.isFunction(fn)) {
                    if (e) {
                        result = fn(e);
                    } else {
                        result = fn();
                    }
                    if ($.isNotEmpty(result)) {
                        return result;
                    }
                }
            }
        },

        isEmpty: function (value) {
            /// <summary>判断是否为空，为空返回 true 不为空返回false</summary>
            /// <param name="value" type="Object">值</param>
            /// <returns type="Boolean">是否为空</returns>

            return ((value === undefined || value === null || value === "" || value === "undefined") ? true : false);
        },

        isNotEmpty: function (value) {
            /// <summary>判断是否为空 为空返回 false 不为空返回true</summary>
            /// <param name="value" type="Object">值</param>
            /// <returns type="Boolean">是否不为空</returns>

            return ((value === undefined || value === null || value === "" || value === "undefined") ? false : true);
        },

        setDefault: function (value, _default) {
            if ($.isNotEmpty(value)) {
                return value;
            } else {
                if (typeof _default === "function") {
                    return _default();
                }
                return _default;
            }
        },

        isString: function (obj) {
            /// <summary>判断是否为字符串，为字符串返回 true 否返回false</summary>
            /// <param name="obj" type="Object">值</param>
            /// <returns type="Boolean">是否为字符串</returns>
            if (typeof obj === "string") {
                return true;
            } else {
                return false;
            }
        },

        getQueryString: function (parameter) {
            /// <summary>获取链接参数</summary>
            /// <param name="parameter" type="String">参数名称</param>
            /// <returns type="Boolean">是否不为空</returns>

            var reg = new RegExp("(^|&)" + parameter + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },

        isEmptyValue: function (value, type) {
            /// <summary>判断值是否为空 为空返回默认值</summary>
            /// <param name="value" type="Object">参数值</param>
            /// <param name="type" type="String">参数类型</param>
            /// <returns type="Boolean">不为空时返回该值 为空返回默认值</returns>

            if (this.isEmpty(value)) {
                switch (type) {
                    case "string":
                        value = "";
                        break;
                    case "number":
                        value = 0;
                        break;
                    case "boolean":
                        value = false;
                        break;
                    default:
                        value = "";
                        break;
                }
            }
            return value;
        },

        path: {
            //协议
            protocol: window.location.protocol,
            //地址
            hostname: window.location.hostname,
            //端口
            port: window.location.port,

            httpPath: function (virtual) {
                if (!virtual) {
                    virtual = "";
                }
                if (this.port === "") {
                    return this.protocol + "//" + this.combine(this.hostname, virtual);
                } else {
                    return this.protocol + "//" + this.combine(this.hostname + ":" + this.port, virtual);
                }
            },

            combine: function (path1, path2) {
                if ($.isArray(path1)) {
                    var path = "";
                    for (var i = 0; i < path1.length; i++) {
                        if ((i + 1) === path1.length) {
                            break;
                        }
                        if ($.isEmpty(path)) {
                            path = path1[i];
                        }
                        path = this.combine(path, path1[i + 1]);
                    }
                    return path
                } else if ($.isString(path1)) {
                    if ($.isEmpty(path2)) {
                        return path1;
                    }
                    return path1 + "/" + path2;
                }
            }
        },

        loadData: {
            ajax: function (url, type, data, callBack, errorCallBack) {
                /// <summary>ajax</summary>
                /// <param name="url" type="String">访问地址</param>
                /// <param name="type" type="String">访问类型 POST GET</param>
                /// <param name="data" type="Object">传值</param>
                /// <param name="callBack" type="Function">返回成功回调函数</param>
                /// <param name="errorCallBack" type="Function">返回失败回调函数</param>

                $.ajax({
                    url: url,
                    type: type,
                    data: data,
                    dataType: "json",
                    success: function (result) {
                        if (callBack) {
                            callBack(result);
                        }
                    },
                    error: function (ex) {
                        if (errorCallBack) {
                            errorCallBack(ex);
                        }
                    }
                });
            }
        },

        string: {
            empty: "",

            removeLast: function (str) {
                /// <summary>去除最后一个字符</summary>
                /// <param name="str" type="String">传入字符</param>
                /// <returns type="String">去除后的值</returns>>

                return substring(0, str.length - 1);
            }
        },

        date: {
            now: function (format) {
                /// <summary>获取当前时间</summary>
                /// <param name="format" type="String">日期格式</param>
                /// <returns type="String">当前时间</returns>>

                return this.format(new Date, format);
            },

            format: function (date, format) {
                /// <summary>格式化时间</summary>
                /// <param name="date" type="Date">时间</param>
                /// <param name="format" type="String">日期格式</param>
                /// <returns type="String">格式化后时间</returns>>

                if (!$.isFunction(Date.prototype.format)) {
                    Date.prototype.format = function (format) {
                        var date = {
                            "M+": this.getMonth() + 1,
                            "d+": this.getDate(),
                            "h+": this.getHours(),
                            "m+": this.getMinutes(),
                            "s+": this.getSeconds(),
                            "q+": Math.floor((this.getMonth() + 3) / 3),
                            "S+": this.getMilliseconds()
                        };
                        if (/(y+)/i.test(format)) {
                            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                        }
                        for (var k in date) {
                            if (new RegExp("(" + k + ")").test(format)) {
                                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                            }
                        }
                        return format;
                    }
                }
                if (format) {
                    if (date) {
                        return date.format(format);
                    } else {
                        return this.now(format);
                    }
                } else {
                    return undefined;
                }
            }
        }
    });

    $.each(["get", "post"], function (i, method) {
        $.loadData[method] = function (url, data, callBack, errorCallBack) {
            if ($.isFunction(data)) {
                if ($.isNotEmpty(callBack)) {
                    errorCallBack = callBack;
                }
                callBack = data;
                data = undefined;
            }
            $.loadData.ajax(url, method, data, callBack, errorCallBack);
        };
    });

    $.fn.extend({
        imgHover: function (overImg, outImg, path) {
            /// <summary>图片鼠标移入移出方法</summary>
            /// <param name="overImg" type="String">鼠标移入图片</param>
            /// <param name="outImg" type="String">鼠标移出图片</param>
            /// <param name="path" type="String">文件路径</param>

            $(this).hover(function () {
                bind(this, overImg, path);
            }, function () {
                bind(this, outImg, path);
            });

            //设置鼠标手势
            $(this).css("cursor", "pointer");

            //设置图片
            function bind(dom, img, path) {
                if (path) {
                    $(dom).attr("src", $.path.combine(path, img));
                } else {
                    $(dom).attr("src", img);
                }
            }
        }
    });

})(window, jQuery);