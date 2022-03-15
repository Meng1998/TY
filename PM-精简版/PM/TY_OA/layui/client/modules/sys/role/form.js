"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeSelectEx: "middleware/plugin/treeSelect",//下拉树扩展
}).define(["base", "form", "treeSelectEx"], function (exports) {

    var treeSelect = layui.treeSelect;
    var request = layui.request;
    var form = layui.form;
    var common = layui.common;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    treeSelect.load({
        elem: "dept_id",
        url: "/sys/department/list",
        placeholder: "请选择所属部门",
        search: false,
        height: "170px",
        click: function (data) {
            $("[name='dept_id']").val(data.current.id);
            $("[name='dept_name']").val(data.current.dept_name);
        },
        success: function () {
            treeSelect.zTree("LAY-tree-dept").expandAll(true);
            //判断是否为编辑
            var id = $("[name='id']").val();
            if (id) {
                request.post({
                    url: "/sys/role",
                    data: { id: id },
                    success: function (data) {
                        form.val(LAY_FORM, data);
                        if (data.dept_id) {
                            //选择下拉框数据
                            treeSelect.checkNode("LAY-tree-dept", data.dept_id);
                        }
                    }
                });
            }
        }
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id"],
            url: {
                update: "/sys/role/update",
                create: "/sys/role/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});