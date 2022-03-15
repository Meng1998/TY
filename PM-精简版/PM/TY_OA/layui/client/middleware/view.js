"use script";

/**
 * @description 视图模块
 */
layui.define(function (exports) {
    var laytpl = layui.laytpl;
    var $ = layui.jquery;

    /**
     * @constructor
     * @description 视图操作类
     * @param {string} id 元素Id
     * @example
     * new view(id);
     */
    var view = function (id) {
        //对外接口
        return new Class(id);
    }

    function Class(id) {
        this.id = id;
        this.container = $("#" + id);
    }

    Class.prototype.render = function (url) {
        var that = this;
        //动态模板所在目录
        var url = layui.cache.base + url + ".html";

        $.ajax({
            url: url,
            type: "get",
            dataType: "html",
            success: function (html) {
                html = '<div>' + html + '</div>';
                that.parse(html);
            }
        });
    }


    Class.prototype.parse = function (html, refresh) {
        var that = this;
        var isScriptTpl = (typeof html === "object");//是否模板元素
        var elem = isScriptTpl ? html : $(html);
        var elemTemp = isScriptTpl ? html : elem.find('*[template]')
        var router = layui.router();

        var fn = function (options) {
            var tpl = laytpl(options.dataElem.html());
            var res = $.extend({
                params: router.params
            }, options.res);

            options.dataElem.after(tpl.render(res));

            try {
                options.done && new Function('d', options.done)(res);
            } catch (e) {
                console.error(options.dataElem[0], '\n存在错误回调脚本\n\n', e)
            }
        }

        elem.find('title').remove();
        that.container['html'](elem.children());

        router.params = that.params || {};

        //遍历模板区块
        for (var i = elemTemp.length; i > 0; i--) {
            (function () {
                var dataElem = elemTemp.eq(i - 1);
                var layDone = dataElem.attr('lay-done') || dataElem.attr('lay-then') //获取回调
                fn({
                    dataElem: dataElem,
                    done: layDone
                });
            }());
        }

        return that;
    }

    //对外接口
    exports("view", view);
});