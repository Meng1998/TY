"use script";

/**
 * 扩展xmSelect方法
 */
layui.extend({
    xmSelect: "plugin/xmSelect"
}).define("xmSelect", function (exports) {

    var request = layui.request;

    /**
     * 重写加载数据
     * @param {object} options 加载参数
     */
    layui.xmSelect.load = async function (options) {
        var select = {};
        await request[options.data ? "post" : (options.method ? options.method : "get")]({
            url: options.url,
            data: options.data,
            dataType: options.dataType ? options.dataType : "json",
            success: function (data) {
                if (options.parseData) {
                    data = options.parseData(data);
                }
                select = layui.xmSelect.render({
                    el: "#" + options.elem,
                    language: 'zn',
                    prop: options.prop ? options.prop : { name: "dic_name", value: "op_value", },
                    data: data
                });
            }
        });
        return select;
    }
    
    exports("xmSelectEx", layui.xmSelect);
});