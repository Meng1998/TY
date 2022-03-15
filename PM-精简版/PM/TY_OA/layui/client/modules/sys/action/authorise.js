"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    treeTableEx: "middleware/plugin/treeTable",//树列表扩展
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx"], function (exports) {

    var table = layui.table;
    var form = layui.form;
    var request = layui.request;
    var $ = layui.$;

    var LAY_ROLE_MANAGE = "LAY-role-manage";

    var toolbarEvent = {
        checked: function (row) {
            alert();
        }
    }

    table.load({
        elem: LAY_ROLE_MANAGE,
        toolbarEvent: toolbarEvent,
        url: "/sys/role_action/roleForAction",
        height: "full-50",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "角色名称", field: "role_name", align: "left", halign: "center", width: 370 },
            {
                title: '是否分配', width: 110, unresize: true, templet: function (d) {
                    var html = ['<input type="checkbox" name="lock" title="分配" lay-filter="authorise"  '];
                    html.push('  value=' + d.id + ' ');
                    html.push('  raId=' + d.ra_id + ' ');
                    html.push(d.authorise == 1 ? ' checked' : '');
                    html.push('/>');
                    return html.join('');
                }
            }
        ],
        fixed: { action_id: $("[name='action_id']").val() }
    });

    //监听分配操作
    form.on('checkbox(authorise)', function (obj) {
        var data = {
            role_id: obj.value,
            action_id: $("[name='action_id']").val()
        }
        if (!obj.elem.checked) {
            data.id = $(obj.elem).attr("raId");
        }

        request.post({
            url: "/sys/role_action/editRoleAction",
            data: data,
            success: function (result) {
                layer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //对外输出
    exports("main", {});
});