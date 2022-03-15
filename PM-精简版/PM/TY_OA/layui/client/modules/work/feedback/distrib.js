"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "form", "tableEx", "laydate"], async function (exports) {

    var common = layui.common;
    var laydate = layui.laydate;
    var setter = layui.setter;
    var table = layui.table;
    var $ = layui.$;

    var LAY_USER_MANAGE = "LAY-user-manage";

    //项目反馈完成状态
    var FinishStatus = await layui.base.dictionary(setter.dictionary.FinishStatus);

    $("[name='status']").val(FinishStatus.notstarted);

    var user = layui.sessionData("session").user

    $("[name='assignor_id']").val(user.id);
    $("[name='assignor_name']").val(user.full_name);

    //日期控件
    laydate.render({
        elem: "input[name='estimate_time']",
        showBottom: false
    });

    /**
    * 初始化数据
    */
    table.load({
        elem: LAY_USER_MANAGE,
        url: "/sys/user/list",
        height: "full-50",
        page: false,
        cols: [
            { type: "numbers" },
            { title: "部门人员", field: "full_name", align: "center" }
        ],
        fixed: { job_status: "1", dept_id: user.dept_id },
        rowClick: function (row) {
            $("[name='designee_id']").val(row.id);
            $("[name='designee_name']").val(row.full_name);
        }
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            url: {
                update: "/prj/feedback/update"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});