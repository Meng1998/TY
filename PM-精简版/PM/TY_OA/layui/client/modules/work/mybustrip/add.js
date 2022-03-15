"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    asynTreeSelectEx: "middleware/plugin/asynTreeSelect"
}).define(["base", "form", "laydate", "asynTreeSelectEx"], async function (exports) {

    var laydate = layui.laydate;
    var setter = layui.setter;
    var common = layui.common;
    var form = layui.form;
    var asynTreeSelect = layui.asynTreeSelect;
    var $ = layui.$;

    //人员出差类型
    var BustripType = await layui.base.dictionary(setter.dictionary.BustripType);
    BustripType.render({ elem: "[name='type']" });

    laydate.render({
        elem: "input[name='start_time']",
    });

    asynTreeSelect.load({
        elem: '#region',
        url: "/sys/region/list",
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

    form.on("select(LAY-select)", function (data) {
        if (data.value === BustripType.customercommun) {
            //客户交流
            $("[name='project_id']").val("");
            $("[name='project_name']").val("");
        }
    });

    $("[name='project_name']").click(function () {
        var type = $("[name='type']").val();
        if (type === BustripType.customercommun) {
            layer.tips("   客户交流无需选择项目！  ", $("[name='project_name']"), {
                tips: [1, '#009688'],
                time: 2000
            });
            return;
        }
        openForm({
            title: "选择项目",
            content: "project.html",
            area: ["1450px", "800px"],
            yes: function (data) {
                $("[name='project_id']").val(data.id);
                $("[name='project_name']").val(data.project_name);
                $("[name='custom_id']").val(data.custom_id);
                $("[name='custom_name']").val(data.custom_name);
                $("[name='contacts_name']").val(data.contacts_name);
                $("[name='contacts_tel']").val(data.contacts_tel);
            }
        });
    });

    $("[name='custom_name']").click(function () {
        var type = $("[name='type']").val();
        if (type !== BustripType.customercommun) {
            layer.tips("   项目客户无法更改！  ", $("[name='custom_name']"), {
                tips: [1, '#009688'],
                time: 2000
            });
            return;
        }
        openForm({
            title: "选择客户",
            content: "custom.html",
            area: ["1050px", "800px"],
            yes: function (data) {
                $("[name='custom_id']").val(data.id);
                $("[name='custom_name']").val(data.custom_name);

                $("[name='contacts_name']").val("");
                $("[name='contacts_tel']").val("");
            }
        });
    });

    $("[name='contacts_name']").click(function () {
        if (!$("[name='custom_id']").val()) {
            layer.tips("   请选择客户！  ", $("[name='contacts_name']"), {
                tips: [1, '#009688'],
                time: 2000
            });
            return;
        }
        openForm({
            title: "选择客户联系人",
            content: "contacts.html",
            area: ["520px", "800px"],
            success: function (win) {
                win.custom_id = $("[name='custom_id']").val();
            },
            yes: function (data) {
                $("[name='contacts_name']").val(data.contacts_name);
                $("[name='contacts_tel']").val(data.contacts_tel);
            }
        });
    });

    function openForm(options) {
        window.parentLayer.open({
            type: 2,
            title: options.title,
            content: options.content,
            area: options.area,
            btn: ["确定", "取消"],
            success: function (layero, index) {
                var iframeWin = window.parent[layero.find("iframe")[0]["name"]]
                iframeWin.parentLayer = window.parentLayer;
                if (options.success) {
                    options.success(iframeWin);
                }
            },
            yes: function (index, layero) {
                var iframeWin = window.parent[layero.find("iframe")[0]["name"]];
                iframeWin.select(function (row) {
                    if (options.yes) {
                        options.yes(row);
                    }
                    window.parentLayer.close(window.parentLayer.index);
                });
            }
        });
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        common.submitForm({
            removeKeys: ["id", "project_id", "project_name", "county", "county_name"],
            url: {
                create: "/work/bustrip/create"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});