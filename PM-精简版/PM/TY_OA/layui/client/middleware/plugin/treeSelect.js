"use script";

/**
 * 扩展treeSelect方法
 */
layui.extend({
    treeSelect: "plugin/treeSelect"
}).define("treeSelect", function (exports) {

    /**
     * 重写加载treeSelect
     * @param {object} options 加载参数
     */
    layui.treeSelect.load = function (options) {
        var treeSelectIns = layui.treeSelect.render({
            elem: "#" + options.elem,
            url: layui.base.API_URL(options.url),
            data: options.data,
            type: options.type ? options.type : "get",
            placeholder: options.placeholder ? options.placeholder : "",
            search: options.search,
            setting: options.setting,
            height: options.height ? options.height : "300px",
            headers: {
                Authorization: "application/json",
                token: layui.base.getToken(),
                user: (layui.sessionData("session").user) ? layui.sessionData("session").user.user_name : ""
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
            filter: function (event, treeId, treeNode) {
                if (options.filter) {
                    return options.filter(event, treeId, treeNode);
                }
                return true;
            },
            // 点击回调
            click: function (d) {
                if (options.click) {
                    options.click(d);
                }
            },
            // 加载完成后的回调函数
            success: function (d) {
                if (options.success) {
                    options.success(d);
                }
            }
        });

        return treeSelectIns;
    }

    exports("treeSelectEx", layui.treeSelect);
});