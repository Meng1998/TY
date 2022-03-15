"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "form"], async function (exports) {

    var setter = layui.setter;
    var common = layui.common;
    var $ = layui.$;

    //项目反馈完成状态
    var FinishStatus = await layui.base.dictionary(setter.dictionary.FinishStatus);

    $("[name='status']").val(FinishStatus.reject);

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