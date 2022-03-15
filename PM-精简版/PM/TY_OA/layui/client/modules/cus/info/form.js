"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    asynTreeSelectEx: "middleware/plugin/asynTreeSelect"
}).define(["base", "form", "asynTreeSelectEx"], async function (exports) {

    var common = layui.common;
    var request = layui.request;
    var form = layui.form;
    var asynTreeSelect = layui.asynTreeSelect;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/cus/info",
            data: { id: id },
            success: function (data) {
                form.val(LAY_FORM, data);
                var defaultValue = "";
                if (data.county !== "") {
                    defaultValue = data.county
                } else if (data.city !== "") {
                    defaultValue = data.city
                }
                asynTreeSelectIns.reload({ defaultValue: defaultValue });
            }
        });
    }

    var asynTreeSelectIns = asynTreeSelect.load({
        elem: '#region',
        url: "/sys/region/list",
        maxHeight: "180px",
        onClick: function (data) {
            var pid = data.pid;
            if (pid === "100000") {
                //省级
                $("[name='province']").val(data.id);
                $("[name='province_name']").val(data.name);
            } else {
                const lastFourCode = pid.slice(-4);
                const lastTwoCode = pid.slice(-2);
                if (lastFourCode === "0000") {
                    //市级
                    $("[name='city']").val(data.id);
                    $("[name='city_name']").val(data.name);
                    return;
                }
                if (lastTwoCode === "00") {
                    //区级
                    $("[name='county']").val(data.id);
                    $("[name='county_name']").val(data.name);
                    return;
                }
            }
        }
    });


    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id", "county", "county_name"],
            url: {
                update: "/cus/info/update",
                create: "/cus/info/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});