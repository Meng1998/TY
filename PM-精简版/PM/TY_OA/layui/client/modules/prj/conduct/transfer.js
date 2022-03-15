"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var setter = layui.setter;
    var common = layui.common;
    var $ = layui.$;

    var LAY_PERSON_MANAGE = "LAY-person-manage";

    /**
    * 初始化数据
    */
    table.load({
        elem: LAY_PERSON_MANAGE,
        url: "/sys/user/list",
        page: false,
        height: "full-20",
        cols: [
            { type: "numbers" },
            { title: "项目经理", field: "full_name", align: "center" }
        ],
        fixed: {
            dept_id: setter.other.dept.project_manager,//项目部Id
            job_status: "1"         //在职
        },
        rowClick: function (param) {
            $("[name='person_id']").val(param.id);
            $("[name='person_name']").val(param.full_name);
        }
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        window.parentLayer.confirm("是否将 <font color='#0000FF'>" + $("[name='project_name']").val() + "</font> 移交给：" + $("[name='person_name']").val(), {
            title: "提示"
        }, function () {
            window.parentLayer.close(window.parentLayer.index);
            common.submitForm({
                url: {
                    update: "/prj/info/update"
                }
            }, callback);
        });
    }

    //对外输出
    exports("main", {});
});