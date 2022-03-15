"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form", "laydate"], async function (exports) {

    var laydate = layui.laydate;
    var setter = layui.setter;
    var common = layui.common;

    //人员请假类型
    var LeaveType = await layui.base.dictionary(setter.dictionary.LeaveType);
    LeaveType.render({ elem: "[name='type']" });

    laydate.render({
        elem: "input[name='start_time']",
        trigger: "click",
        type: 'datetime',
        done: function (value, date) {
            //更新结束日期的最小日期
            end_time.config.min = lay.extend({}, date, {
                month: date.month - 1
            });

            //自动弹出结束日期的选择器
            end_time.config.elem[0].focus();
        }
    });

    var end_time = laydate.render({
        elem: "input[name='end_time']",
        type: 'datetime',
        trigger: "click"
    });


    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id"],
            url: {
                create: "/work/leave/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});