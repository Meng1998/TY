"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form", "laydate"], async function (exports) {

    var table = layui.table;
    var laydate = layui.laydate;
    var form = layui.form;
    var request = layui.request;
    var $ = layui.$;

    var LAY_ATTENDANCE_MANAGE = "LAY-attendance-manage";

    var tableIns;

    //参数
    var param = {
        users: {}
    }

    laydate.render({
        elem: "input[name='start_time']",
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
        elem: "input[name='end_time']"
    });

    //获取打卡用户
    request.post({
        url: "/sys/user/list",
        data: {
            ding_attendance: "1",
            job_status: "1"
        },
        success: function (data) {
            param.users = data.list;
        }
    });

    function loadAttendance() {
        tableIns = table.load({
            elem: LAY_ATTENDANCE_MANAGE,
            url: "/dingtalk/attendance/attendanceForMonth",
            row: false,
            page: false,
            theads: thead(),
            fixed: {
                users: JSON.stringify(param.users),
                start_time: $("[name='start_time']").val(),//起始时间
                end_time: $("[name='end_time']").val()//结束时间 
            },
            done: function (instance, options) {
                var that = instance.elem.next();

                //设置背景
                function setbg(tr, result, item) {
                    if (result.fields.length === 0) {
                        return;
                    }
                    var attr = "";
                    for (let i = 0; i < result.fields.length; i++) {
                        const field = result.fields[i];
                        attr += "[data-field='" + field + "'],";
                    }
                    var td = tr.find("td" + attr.substring(0, attr.length - 1));
                    td.css("background-color", result.bgcolor);
                    td.css("color", result.color);

                    if (result.name === "Bustrip") {
                        for (let i = 0; i < result.fields.length; i++) {
                            const field = result.fields[i];
                            var td = tr.find("td[data-field='" + field + "']");
                            var objField = field.replace("TimeResultText", "BustripInfo");
                            var title = "";
                            if (item[objField].project_name) {
                                title += item[objField].project_name + "\n";
                            }
                            if (item[objField].excues) {
                                title += item[objField].excues + "\n";
                            }
                            if (item[objField].remark) {
                                title += item[objField].remark;
                            }

                            td.attr("title", title);
                            td.css("cursor", "pointer");
                        }
                    }
                }

                options.res.data.forEach(function (item, index) {
                    var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");

                    var Normal = { name: "Normal", bgcolor: "#1E9FFF", color: "#FFF", fields: [] },
                        Late = { name: "Late", bgcolor: "#FF4444", color: "#FFF", fields: [] },
                        Early = { name: "Early", bgcolor: "#5cb85c", color: "#FFF", fields: [] },
                        NotSigned = { name: "NotSigned", bgcolor: "#F39911", color: "#FFF", fields: [] },
                        Leave = { name: "Leave", bgcolor: "#235cff", color: "#FFF", fields: [] },
                        Bustrip = { name: "Bustrip", bgcolor: "#dd74f3", color: "#FFF", fields: [] };

                    for (var p in item) {
                        if (p.indexOf("TimeResult") > 0) {
                            switch (item[p]) {
                                case "Normal":
                                    Normal.fields.push(p.replace("TimeResult", "TimeResultText"));
                                    break;
                                case "Late":
                                    Late.fields.push(p.replace("TimeResult", "TimeResultText"));
                                    break;
                                case "Early":
                                    Early.fields.push(p.replace("TimeResult", "TimeResultText"));
                                    break;
                                case "NotSigned":
                                    NotSigned.fields.push(p.replace("TimeResult", "TimeResultText"));
                                    break;
                                case "Leave":
                                    Leave.fields.push(p.replace("TimeResult", "TimeResultText"));
                                    break;
                                case "Bustrip":
                                    Bustrip.fields.push(p.replace("TimeResult", "TimeResultText"));
                                    break;
                            }
                        }
                    }

                    setbg(tr, Normal);
                    setbg(tr, Late);
                    setbg(tr, Early);
                    setbg(tr, NotSigned);
                    setbg(tr, Leave);
                    setbg(tr, Bustrip, item);
                });
            }
        });
    }

    /**
     * 获取表头
     */
    function thead() {

        var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

        var start_time = new Date($("[name='start_time']").val());//起始时间
        var end_time = new Date($("[name='end_time']").val());//结束时间
        var days = ((end_time - start_time) / (1 * 24 * 60 * 60 * 1000)) + 1;//获取相差天数

        //根据表头生成天数
        var firstHead = [], secondHead = [];
        firstHead.push({ type: "numbers", title: "序号", rowspan: 2, fixed: "left" });
        firstHead.push({ title: "人员名称", field: "user_name", align: "center", width: 110, rowspan: 2, fixed: "left" });

        var current_date = start_time.format("yyyy-MM-dd");//当前循环时间
        //一级表头
        for (let i = 0; i < days; i++) {
            const dayNum = i;
            if (dayNum !== 0) {
                current_date = getNextDay(current_date);
            }
            var date = new Date(current_date);
            var dateFormat = date.format("yyyy-MM-dd_");
            var weekNum = date.getDay();
            firstHead.push({ title: date.format("MM.dd") + "（" + weekday[weekNum] + "）", align: "center", colspan: 2 });
            (function (dateFormat) {
                secondHead.push({
                    title: "上班",
                    align: "center",
                    field: dateFormat + "OnDutyTimeResultText",
                    width: 80,
                    templet: function (row) {
                        return formatData(row, dateFormat, "OnDuty");
                    }
                });
                secondHead.push({
                    title: "下班",
                    align: "center",
                    field: dateFormat + "OffDutyTimeResultText",
                    width: 80,
                    templet: function (row) {
                        return formatData(row, dateFormat, "OffDuty");
                    }
                });

                function formatData(row, dateFormat, checkType) {
                    var DutyTimeResult = row[dateFormat + checkType + "TimeResult"];
                    if (DutyTimeResult) {
                        if (DutyTimeResult === "Normal" || DutyTimeResult === "Early" || DutyTimeResult === "Late") {
                            return row[dateFormat + checkType].toDate("hh:mm");
                        } else if (DutyTimeResult === "Bustrip") {
                            return row[dateFormat + checkType + "BustripPlace"];
                        } else {
                            return row[dateFormat + checkType + "TimeResultText"];
                        }
                    }
                    return "";
                }
            })(dateFormat);
        }
        return [firstHead, secondHead];
    }

    /**
     * 获取下一天
     * @param {string} d 日期
     */
    function getNextDay(date) {
        date = new Date(date);
        date = +date + 1000 * 60 * 60 * 24;
        date = new Date(date);
        //格式化
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    //监听搜索
    form.on("submit(LAY-attendance-search)", function (data) {
        loadAttendance();
        return false;
    });

    //监听搜索
    form.on("submit(LAY-attendance-export)", function (data) {
        layer.msg("没有导出，自己手动复制吧！！！", { icon: 8 })
        return false;
    });

    //对外输出
    exports("main", {});
});