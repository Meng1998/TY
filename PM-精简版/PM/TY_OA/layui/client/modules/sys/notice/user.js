"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var form = layui.form;
    var request = layui.request;
    var $ = layui.$;

    var LAY_USER_MANAGE = "LAY-user-manage";

    var LAY_FORM = "LAY-form";

    /**
    * 初始化数据
    */
    request.post({
        url: "/work/notice_user/list",
        data: { notice_id: $("[name='notice_id']").val() },
        success: function (data) {
            var checked_users = data.list
            table.load({
                elem: LAY_USER_MANAGE,
                url: "/sys/user/list",
                row: false,
                page: false,
                height: "full-50",
                cols: [
                    { type: "checkbox" },
                    { title: "真实姓名", field: "full_name", align: "center" },
                    { title: "所属部门", field: "dept_name", align: "center", width: 150 },
                    { title: "人员角色", field: "role_name", align: "center", width: 170 }
                ],
                fixed: { job_status: "1" },
                parseData: function (data) {
                    for (let i = 0; i < data.data.length; i++) {
                        const item = data.data[i];
                        for (let j = 0; j < checked_users.length; j++) {
                            const checked_user = checked_users[j];
                            if (checked_user.user_id === item.id) {
                                item.LAY_CHECKED = true;
                                break;
                            }
                        }
                    }
                    return data;
                }
            });
        }
    });

    window.submit = function (callback) {
        var notice_user = form.val(LAY_FORM);
        var check_user = table.checkStatus(LAY_USER_MANAGE).data;
        var users = [];
        for (let i = 0; i < check_user.length; i++) {
            const user = check_user[i];
            users.push({
                role_id: user.role_id,
                user_role: user.role_name,
                user_id: user.id,
                user_name: user.full_name,
                head_img: user.head_img
            });
        }
        notice_user.data = JSON.stringify(users);
        request.post({
            url: "/work/notice_user/create",
            data: notice_user,
            success: function () {
                callback("数据修改成功！");
            }
        });
    }

    //对外输出
    exports("main", {});
});