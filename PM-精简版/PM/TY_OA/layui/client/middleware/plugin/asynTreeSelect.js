"use script";

/**
 * 扩展异步下拉框方法
 */
layui.extend({
    asynTreeSelect: "plugin/asynTreeSelect"
}).define("asynTreeSelect", function (exports) {

    /**
     * 重写异步下拉框
     * @param {object} options 加载参数
     */
    layui.asynTreeSelect.load = function (options) {
        var asynTreeSelect = layui.asynTreeSelect.render({
            elem: options.elem,
            getCurrentNodeUrl: layui.base.API_URL(options.url),
            getChildrenNodeUrl: layui.base.API_URL(options.url),
            getBrotherNodeUrl: layui.base.API_URL(options.url),
            paramName: options.paramName ? options.paramName : "pid",
            rootNodeValue: options.rootNodeValue ? options.rootNodeValue : "100000",
            defaultValue: options.defaultValue ? options.defaultValue : "",
            paramType: "postType",
            separator: " ",
            showRootNode: false,
            //maxWidth: options.maxWidth ? options.maxWidth : 400,
            maxHeight: options.maxHeight ? options.maxHeight : 300,
            response: {
                idName: options.idName ? options.idName : "id",
                valueName: options.valueName ? options.valueName : "name",
                parentName: options.parentName ? options.parentName : "pid"
            },
            parseData: function (result) {
                var data;
                layui.base.resHandle({
                    result: result,
                    success: function (result) {
                        data = result;
                        if (options.parseData) {
                            data = options.parseData(data);
                        }
                    },
                    error: function (result) {
                    }
                });
                return data;
            },
            onClick: function (data) {
                if (options.onClick) {
                    options.onClick(data);
                }
            }
        });

        return asynTreeSelect;
    }

    exports("asynTreeSelectEx", layui.asynTreeSelect);
});