"use script";

/**
 * 公共方法处理
 */
layui.define(["request", "form"], function (exports) {

    var request = layui.request;
    var form = layui.form;
    var verify = layui.verify;
    var util = layui.util;
    var $ = layui.$;

    /**
     * 提交Form表单数据
     * @param {object} [options={}] 调用参数
     * @param {string} [options.form] 表单Id
     * @param {string} [options.removeKeys] 移除的属性
     * @param {string} [options.url.update] 数据修改地址
     * @param {string} [options.url.create] 数据添加地址
     * @param {function} callback 回调方法
     * @param {object} noticeMsg 通知消息
     */
    var submitForm = function (options, callback, noticeMsg) {
        if (callback && typeof callback === "object") {
            noticeMsg = callback;
        }

        var field = form.val(options.form ? options.form : "LAY-form");
        var verifyData = util.clone(field, options.removeKeys);
        //非空验证
        if (!verify.execute(verifyData)) {
            return;
        }

        var id = $("[name='id']").val();
        var url = id ? options.url.update : options.url.create;
        var msg = options.msg ? options.msg : (id ? "数据修改成功" : "数据添加成功");

        //添加消息通知
        if (noticeMsg) {
            field.notice = noticeMsg;
            var user = layui.sessionData("session").user;
            field.notice.user_id = user.id;
            field.notice.user_name = user.full_name;
            field.notice.data = JSON.stringify(form.val(options.form ? options.form : "LAY-form"));
        }

        request.post({
            url: url,
            data: field,
            success: function (data) {
                if (callback) {
                    callback(msg);
                }
            }
        });
    }

    /**
     * 行政区划格式化
     * @param {Object} data 结果对象
     */
    var formatRegion = function (data) {
        if (data) {
            return data.province_name + " " + data.city_name + " " + data.county_name;
        } else {
            return "";
        }
    }

    /**
     * 批量执行方法
     * @param {string} value 表格内容
     * @param {array} method 方法数组
     */
    var batch = function (value, method) {
        for (let i = 0; i < method.length; i++) {
            const item = method[i];
            value = table[item](value);
        }
        return value;
    }

    /**
     * 内容居左
     * @param {string} value 表格内容
     */
    var textLeft = function (value) {
        return '<div style="text-align: left;">' + value + '</div>';
    }

    /**
     * 字体蓝色
     */
    var textBlue = function (value) {
        return "<font color='#0000FF' style='cursor: pointer'>" + value + "</font>";
    }

    /**
     * 字体红色
     */
    var textRed = function (value) {
        return "<font color='#FF0000' style='cursor: pointer'>" + value + "</font>";
    }

    /**
     * 字体蓝色
     */
    var textGreen = function (value) {
        return "<font color='#00b050' style='cursor: pointer'>" + value + "</font>";
    }

    /**
     * 内部文字
     */
    var innerText = function (value) {
        return $("<div>" + value + "</div>").text();
    }

    /**
     * 表格处理方法
     */
    var table = {
        textLeft: textLeft,
        textBlue: textBlue,
        textRed: textRed,
        textGreen: textGreen,
        innerText: innerText,
        batch: batch
    }

    /**
     * 打开窗体
     * @param {object} options 
     */
    var openForm = function (options) {
        var _layer = options.layer ? options.layer : layer;
        _layer.open({
            type: 2,
            ident: "options.ident",
            title: options.title,
            content: options.content,
            area: options.area,
            btn: options.btn ? options.btn : ["确定", "取消"],
            success: function (layero, index) {
                var body = _layer.getChildFrame("body", index);
                if (options.id) {
                    if (options.fields) {
                        for (let i = 0; i < options.fields.length; i++) {
                            const field = options.fields[i];
                            if (field.value) {
                                body.find("[name='" + field.dom + "']").val(field.value);
                            } else if (options.row) {
                                if (util.isString(field)) {
                                    body.find("[name='" + field + "']").val(options.row[field]);
                                } else {
                                    body.find("[name='" + field.dom + "']").val(options.row[field.name]);
                                }
                            }
                        }
                    }
                } else {
                    if (options.fields) {
                        for (let i = 0; i < options.fields.length; i++) {
                            const field = options.fields[i];
                            body.find("[name='" + field.dom + "']").val(field.value);
                        }
                    }
                }
                var _window = options.window ? options.window : window;
                var iframeWin = _window[layero.find("iframe")[0]["name"]];
                if (iframeWin) {
                    iframeWin.parentLayer = _layer;
                    iframeWin.parentWindow = _window;
                }
                if (options.iframeAuto) {
                    _layer.iframeAuto(index);
                }
            },
            yes: function (index, layero) {
                var _window = options.window ? options.window : window;
                var iframeWin = _window[layero.find("iframe")[0]["name"]];
                if (iframeWin.submit) {
                    iframeWin.submit(function (msg, data) {
                        _layer.msg(msg, { icon: 1 });
                        _layer.close(index);
                        if (options.yes) {
                            options.yes(data, index, layero);
                        }
                    });
                } else {
                    _layer.close(index);
                }
            }
        });
    }

    /**
     * 接口调用
     * @param {object} options 传入参数
     * @param {object} row 行
     * @param {string} msg 信息
     * @param {function} callback 回调方法
     */
    function operation(options, row, msg, noticeMsg) {
        var _layer = options.layer ? options.layer : layer;
        if (row) {
            if (options.verify) {
                var result = options.verify();
                if (!result) {
                    _layer.msg("该数据无法操作！", { icon: 8 });
                    return;
                }
            }
            var settings = {};
            $.extend(settings, options);
            settings.success = function (data) {
                _layer.close(_layer.index);
                _layer.msg(msg.success, { icon: 1 });
                if (options.success) {
                    options.success(data);
                }
            };

            //添加消息通知
            if (noticeMsg) {
                settings.data.notice = noticeMsg;
                var user = layui.sessionData("session").user;
                settings.data.notice.user_id = user.id;
                settings.data.notice.user_name = user.full_name;
                settings.data.notice.data = "";
            }

            _layer.confirm(msg.prompt, {
                title: "提示"
            }, function () {
                request.post(settings);
            });
        } else {
            _layer.msg("请选择数据！", { icon: 8 });
        }
    }

    exports("common", {
        submitForm: submitForm,
        formatRegion: formatRegion,
        openForm: openForm,
        operation: operation,
        table: table
    });
});