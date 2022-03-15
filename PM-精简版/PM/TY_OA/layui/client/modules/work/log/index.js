"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    timeline: "middleware/plugin/timeline",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "form", "timeline", "tableEx", "laydate"], async function (exports) {

    var common = layui.common;
    var laydate = layui.laydate;
    var request = layui.request;
    var timeline = layui.timeline;
    var setter = layui.setter;
    var table = layui.table;
    var $ = layui.$;

    var LAY_LOG_MANAGE = "LAY-log-manage";

    //项目反馈完成状态
    var FinishStatus = await layui.base.dictionary(setter.dictionary.FinishStatus);

    $("[name='status']").val(FinishStatus.distrib);

    var user = layui.sessionData("session").user

    $("[name='user_id']").val(user.id);
    $("[name='user_name']").val(user.full_name);

    var laydateIns;

    var layDate = {
        now: null,
        select: null
    }

    //加载当月
    request.post({
        url: "/work/log/list",
        data: {
            user_id: user.id
        },
        success: function (data) {
            var mark = {}
            for (let i = 0; i < data.list.length; i++) {
                const item = data.list[i];
                mark[item.date] = "";
            }

            laydateIns = laydate.render({
                elem: "#calendar", //指定元素
                position: "static",
                theme: "grid",
                showBottom: false,
                mark: mark,
                // max: new Date().format("yyyy-MM-dd"),
                ready: function (date) {
                    layDate.now = date.year + "-" + ((date.month.toString().length === 1) ? "0" + date.month : date.month) + "-" + ((date.date.toString().length === 1) ? "0" + date.date : date.date);
                    hide_mr(date);
                    layDate.select = date;
                    loadTimeline();
                    $("[lay-ymd]").click(function () {
                        var date = $(this).attr("lay-ymd");
                        var format = new Date(layDate.now).format("yyyy-M-d");
                        if (format.toDate() <= date.toDate()) {
                            common.openForm({
                                title: "工作日志",
                                content: "form.html",
                                area: ["600px", "664px"],
                                fields: [{ dom: "user_id", value: user.id }, { dom: "user_name", value: user.full_name }, { dom: "date", value: date }],
                                yes: function () {
                                    loadTimeline();
                                }
                            });
                        }
                    });
                },
                change: function (value, date) {
                    hide_mr(date);
                    if (layDate.select.year !== date.year || layDate.select.month !== date.month) {
                        layDate.select = date;
                        loadTimeline();
                    }
                }
            });
        }
    });

    function hide_mr(value) {

        $("[lay-ymd]").css("background-color", "");
        var selector = $("[lay-ymd=" + new Date(layDate.now).format("yyyy-M-d") + "]");
        if (selector.length > 0) {
            selector.css("background-color", "#eee");
            selector.html(selector.text());
        }

        var mm = value.year + '-' + value.month + '-' + value.date;
        $('.laydate-theme-grid table tbody').find('[lay-ymd="' + mm + '"]').removeClass('layui-this');
    }

    function loadTimeline() {
        request.post({
            url: "/work/log/list",
            data: {
                user_id: user.id,
                date: layDate.select.year + "-" + layDate.select.month + "-" + layDate.select.date
            },
            success: function (data) {
                timeline.render({
                    elem: "#log-timeline",
                    dateKey: "date",
                    contentKey: "content",
                    data: data.list,
                    dateFormat: function (date) {
                        var date = new Date(date);
                        return date.format("yyyy年MM月dd日");
                    }
                });
            }
        });
    }

    //对外输出
    exports("main", {});
});