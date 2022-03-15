"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeSelectEx: "middleware/plugin/treeSelect",//下拉树扩展
}).define(["base", "form", "treeSelectEx"], async function (exports) {

    var treeSelect = layui.treeSelect;
    var request = layui.request;
    var form = layui.form;
    var common = layui.common;
    var setter = layui.setter;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    //功能菜单启用状态
    var EnableStatus = await layui.base.dictionary(setter.dictionary.EnableStatus);
    EnableStatus.render({ elem: "[name='action_enable']" });

    form.render();

    treeSelect.load({
        elem: "action_parent",
        url: "/sys/action/list",
        placeholder: "请选择上级菜单",
        search: false,
        setting: {
            data: {
                key: {
                    name: "action_name"
                }
            }
        },
        parseData: function (data) {
            return [{
                id: "0",
                action_name: "根目录功能",
                name: "根目录功能",
                pid: "-1",
                children: data
            }]
        },
        click: function (data) {
            $("[name='action_parent']").val(data.current.id);
        },
        success: function () {
            treeSelect.zTree("LAY-tree-action").expandAll(true);
            //判断是否为编辑
            var id = $("[name='id']").val();
            if (id) {
                request.post({
                    url: "/sys/action",
                    data: { id: id },
                    success: function (data) {
                        form.val(LAY_FORM, data);
                        if (data.action_parent) {
                            //选择下拉框数据
                            treeSelect.checkNode("LAY-tree-action", data.action_parent);
                        }
                    }
                });
            }
        }
    });

    $("[name='action_icon'], i").click(function () {
        window.parentLayer.open({
            type: 2,
            title: "选择图标",
            content: "icon.html",
            area: ["1000px", "600px"],
            success: function (layero, index) {
                var iframeWin = window.parent[layero.find("iframe")[0]["name"]]
                iframeWin.parentLayer = window.parentLayer;
                iframeWin.index = index;
                iframeWin.formWin = window;
            }
        });
    });

    window.setIcon = function (icon) {
        $("[name='action_icon']").val(icon);
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id", "action_intent", "ident"],
            url: {
                update: "/sys/action/update",
                create: "/sys/action/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});