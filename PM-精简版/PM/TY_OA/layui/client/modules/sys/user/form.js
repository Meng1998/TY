"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeSelectEx: "middleware/plugin/treeSelect",//下拉树扩展
}).define(["base", "form", "laydate", "treeSelectEx"], function (exports) {

    var form = layui.form;
    var laydate = layui.laydate;
    var treeSelect = layui.treeSelect;
    var request = layui.request;
    var common = layui.common;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    //日期控件
    laydate.render({
        elem: "input[name='entry_time']"
    });

    treeSelect.load({
        elem: "dept_tree",
        url: "/sys/role/rolesRegion",
        placeholder: "请选择部门角色",
        search: false,
        parseData: function (data) {
            data[0].open = true;
            return data;
        },
        filter: function (event, treeId, treeNode) {
            return treeNode.role ? true : false;
        },
        click: function (data) {
            form.val(LAY_FORM, {
                dept_id: data.current.dept_id,
                dept_name: data.current.dept_name,
                role_id: data.current.id,
                role_name: data.current.role_name,
            });
        },
        success: function () {
            //判断是否为编辑
            var id = $("[name='id']").val();
            if (id) {
                request.post({
                    url: "/sys/user",
                    data: { id: id },
                    success: function (data) {
                        form.val(LAY_FORM, data);
                        //选择下拉框数据
                        treeSelect.checkNode("LAY-tree-dept", data.role_id);
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
            removeKeys: ["id", "dept_id", "role_id", "bank", "bankcard"],
            url: {
                update: "/sys/user/update",
                create: "/sys/user/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});