"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], async function (exports) {

    var common = layui.common;
    var request = layui.request;
    var form = layui.form;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    $("[name='project_name']").click(function () {
        openForm({
            title: "选择项目",
            content: "project.html",
            area: ["1450px", "800px"],
            yes: function (data) {
                $("[name='project_id']").val(data.id);
                $("[name='project_name']").val(data.project_name);
            }
        });
    });

    function openForm(options) {
        window.parentLayer.open({
            type: 2,
            title: options.title,
            content: options.content,
            area: options.area,
            btn: ["确定", "取消"],
            success: function (layero, index) {
                var iframeWin = window.parent[layero.find("iframe")[0]["name"]]
                iframeWin.parentLayer = window.parentLayer;
                if (options.success) {
                    options.success(iframeWin);
                }
            },
            yes: function (index, layero) {
                var iframeWin = window.parent[layero.find("iframe")[0]["name"]];
                iframeWin.select(function (row) {
                    if (options.yes) {
                        options.yes(row);
                    }
                    window.parentLayer.close(window.parentLayer.index);
                });
            }
        });
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id", "project_id"],
            url: {
                create: "/lic/authorize/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});