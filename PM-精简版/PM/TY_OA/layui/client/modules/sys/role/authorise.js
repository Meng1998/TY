"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    authtreeEx: "middleware/plugin/authtree",//下拉树扩展
}).define(["base", "form", "authtreeEx"], function (exports) {

    var request = layui.request;
    var $ = layui.$;

    var LAY_AUTHORISE_TREE = "#LAY-authorise-tree";

    layui.authtree.load({
        elem: LAY_AUTHORISE_TREE,
        url: "/sys/role_action/actionAuthRole",
        data: $("[name='role_id']"),
        type: "post",
        complete: function () {
            layui.authtree.showAll(LAY_AUTHORISE_TREE);
        }
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        var authids = layui.authtree.getChecked(LAY_AUTHORISE_TREE);
        var data = [];
        for (let i = 0; i < authids.length; i++) {
            const item = authids[i];
            data.push({
                role_id: $("[name='role_id']").val(),
                action_id: item
            });
        }
        request.post({
            url: "/sys/role_action/actionChange",
            data: {
                role_id: $("[name='role_id']").val(),
                data: data
            },
            success: function (data) {
                if (callback) {
                    callback("数据更新成功");
                }
            }
        });
    }


    //对外输出
    exports("main", {});
});