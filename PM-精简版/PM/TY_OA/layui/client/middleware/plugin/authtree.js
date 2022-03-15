"use script";

/**
 * 扩展tree方法
 */
layui.extend({
    authtree: "plugin/authtree"
}).define(["authtree", "request"], function (exports) {

    var request = layui.request;

    /**
     * 重写加载数据
     * @param {object} options 加载参数
     */
    layui.authtree.load = function (options) {
        request[options.type ? options.type : "get"]({
            url: options.url,
            data: options.data,
            dataType: options.dataType ? options.dataType : "json",
            success: function (data) {
                // 渲染时传入渲染目标ID，树形结构数据（具体结构看样例，checked表示默认选中），以及input表单的名字
                layui.authtree.render({
                    elem: options.elem,
                    data: data,
                    childKey: "children",
                    nameKey: "action_name",
                    valueKey: "id",
                    complete: options.complete ? options.complete : null
                });
            }
        });
    }

    exports("authtreeEx", layui.authtree);
});