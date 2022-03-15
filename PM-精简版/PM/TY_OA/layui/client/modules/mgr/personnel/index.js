"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    echartsEx: "middleware/lib/echarts",
    noticeEx: "middleware/lib/notice",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "element", "tableEx", "echartsEx", "noticeEx"], async function (exports) {

    var common = layui.common;
    var table = layui.table;
    var setter = layui.setter;
    var request = layui.request;
    var echarts = layui.echarts;
    var notice = layui.notice;
    var $ = layui.$;

    var LAY_BUSTRIP_USER_MANAGE = "LAY-bustrip-user-manage";
    var LAY_BUSTRIP_MANAGE = "LAY-bustrip-manage";
    var LAY_LEAVE_MANAGE = "LAY-leave-manage";
    var LAY_COMPANY_MANAGE = "LAY-company-manage";
    var LAY_NOATTENDANCE_MANAGE = "LAY-noattendance-manage";

    //人员出差类型
    var BustripType = await layui.base.dictionary(setter.dictionary.BustripType);
    //人员请假类型
    var LeaveType = await layui.base.dictionary(setter.dictionary.LeaveType);

    var stateChart = echarts.initialize("stateChart");
    var bustripChart = echarts.initialize("bustripChart");

    //地图点击事件
    bustripChart.click(function (data) {
        $("[lay-id='LAY-bustrip-user-manage']").find("tbody").children("tr").each(function (index) {
            $(this).removeClass(setter.table.selected);
        });
        if (data) {
            for (let i = 0; i < data.records.length; i++) {
                const record = data.records[i];
                $("[lay-id='LAY-bustrip-user-manage']").find("tbody").children("tr").each(function (index) {
                    if (record.index === index) {
                        $(this).addClass(setter.table.selected);
                    }
                });
            }
        } else {
            $("[lay-id='LAY-bustrip-user-manage']").find("tbody").children("tr").each(function (index) {
                $(this).removeClass(setter.table.selected);
            });
        }
    });

    var tableInsBustripUser = table.load({
        elem: LAY_BUSTRIP_USER_MANAGE,
        page: false,
        row: false,
        height: 317,
        cols: [
            { type: "numbers" },
            { title: "外勤人员", field: "user_name", align: "center", width: 100 },
            { title: "所在位置", align: "center", templet: function (row) { return common.formatRegion(row) } },
        ]
    });

    var tableInsLeave = table.load({
        elem: LAY_LEAVE_MANAGE,
        height: "full-497",
        page: false,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "请假人", field: "user_name", align: "center", width: 100 },
            { title: "起始时间", field: "start_time", align: "center", width: 200, templet: function (row) { return row.start_time.UTCToBeiJing(); } },
            { title: "结束时间", field: "end_time", align: "center", width: 200, templet: function (row) { return row.end_time.UTCToBeiJing(); } },
            { title: "请假类型", field: "type", align: "center", width: 100, templet: function (row) { return LeaveType.Formatter(row.type); } },
            { title: "请假原因", field: "excues", align: "center", templet: function (row) { return common.table.textLeft(row.excues); } },
        ]
    });

    var tableInsBustrip = table.load({
        elem: LAY_BUSTRIP_MANAGE,
        height: "full-497",
        page: false,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "外勤人员", field: "user_name", align: "center", width: 110 },
            { title: "外勤事由", field: "excues", align: "center", width: 200, templet: function (row) { return common.table.textLeft(row.excues); } },
            { title: "外勤类型", field: "type", align: "center", width: 100, templet: function (row) { return BustripType.Formatter(row.type); } },
            { title: "起始时间", field: "start_time", align: "center", width: 110 },
            { title: "项目名称", field: "project_name", align: "center", width: 280 },
            { title: "所在位置", align: "center", width: 220, templet: function (row) { return common.formatRegion(row) } },
            { title: "备注", field: "remark", align: "center", templet: function (row) { return common.table.textLeft(row.remark); } }
        ],
        done: function (instance, options) {
            var that = instance.elem.next();
            options.res.data.forEach(function (item, index) {
                var differ_day = item.start_time.DifferDay();
                if (differ_day > 10) {
                    var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");
                    tr.css("background-color", "#FF4444");
                    tr.css("color", "#fff");
                }
            });
        }
    });

    var tableInsCompany = table.load({
        elem: LAY_COMPANY_MANAGE,
        height: "full-497",
        page: false,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "人员名称", field: "user_name", align: "center", width: 100 },
            { title: "上班打卡时间", field: "OnDuty", align: "center", width: 200 },
            { title: "上班打卡结果", field: "OnDutyTimeResultText", align: "center", width: 200 },
            { title: "下班打卡时间", field: "OffDuty", align: "center", width: 200 },
            { title: "下班打卡结果", field: "OffDutyTimeResultText", align: "center", width: 200 },
        ],
        done: function (instance, options) {
            var that = instance.elem.next();

            //设置背景
            function setbg(tr, fields, bgcolor, color) {
                var td = tr.find("td[data-field='" + fields[0] + "'],[data-field='" + fields[1] + "']");
                td.css("background-color", bgcolor);
                td.css("color", color);
            }

            var abnormal = 0;
            options.res.data.forEach(function (item, index) {
                var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");
                switch (item.OnDutyTimeResult) {
                    case "Late":
                        abnormal++;
                        setbg(tr, ["OnDuty", "OnDutyTimeResultText"], "#FF4444", "#FFF");
                        break;
                    case "NotSigned":
                        abnormal++;
                        setbg(tr, ["OnDuty", "OnDutyTimeResultText"], "#F39911", "#FFF");
                        break;
                }

                switch (item.OffDutyTimeResult) {
                    case "Early":
                        setbg(tr, ["OffDuty", "OffDutyTimeResultText"], "#5FB878", "#FFF");
                        break;
                    case "NotSigned":
                        setbg(tr, ["OffDuty", "OffDutyTimeResultText"], "#F39911", "#FFF");
                        break;
                }
            });
            //修改表头
            $("#company-title").append("(" + options.res.data.length + "/" + abnormal + ")");
        }
    });

    var tableInsNoattendance = table.load({
        elem: LAY_NOATTENDANCE_MANAGE,
        height: "full-497",
        page: false,
        row: false,
        cols: [
            { type: "numbers" },
            { title: "其他人员", field: "full_name", align: "center", width: 200 }
        ]
    });

    //初始化数据
    request.when({
        //ajax请求
        deferreds: [
            { name: "user", url: "/sys/user/list", data: { superadmin: false, job_status: "1" } },
            { name: "personnel", url: "/mgr/personnel/status" },
            { name: "geoAtlas", url: "/getGeoAtlas", data: { code: "100000" } }
        ],
        success: function (result) {
            var personnel = result.personnel;
            //人员状态数据
            stateChart.render({
                title: { text: "人员当前状态", subtext: "当前人员总数：" + personnel.total + "人", left: 'center', textStyle: { fontSize: 18 } },
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c}" },
                legend: { orient: 'vertical', x: 'left', data: ["公司", "出差/外勤", "请假"] },
                label: {
                    formatter: '{b|{b}：}{c}', backgroundColor: '#eee', borderColor: '#aaa', borderWidth: 1, borderRadius: 4, padding: [0, 7],
                    rich: { b: { fontSize: 14, lineHeight: 26 }, per: { color: '#eee', backgroundColor: '#334455', padding: [2, 4], borderRadius: 2 } }
                },
                series: [{
                    name: '人员数量', type: 'pie', startAngle: 120, radius: ['35%', '65%'], center: ['50%', '55%'],
                    data: [
                        { value: personnel.total - (personnel.bustrip.count + personnel.leave.count), name: "公司" },
                        { value: personnel.bustrip.count, name: "出差/外勤" },
                        { value: personnel.leave.count, name: "请假" }
                    ]
                }]
            });

            var numStatistics = {};
            for (let i = 0; i < personnel.bustrip.data.length; i++) {
                const item = personnel.bustrip.data[i];
                item.index = i;
                if (numStatistics[item.province_name]) {
                    numStatistics[item.province_name].count++;
                    numStatistics[item.province_name].records.push(item);
                } else {
                    numStatistics[item.province_name] = {
                        count: 1,
                        records: [item]
                    };
                }
            }

            //外勤数据
            var data = [];
            for (var p in numStatistics) {
                data.push({ name: p, value: numStatistics[p].count, records: numStatistics[p].records });
            }

            //初始化地图数据
            echarts.registerMap("china", result.geoAtlas);
            //外勤人员统计
            bustripChart.render({
                title: { text: "外勤人员分布", left: "0", subtext: "当前外勤人员：" + personnel.bustrip.count + "人", textStyle: { fontSize: 18 } },
                tooltip: { formatter: function (param) { var tip = param.name + "：" + (param.value ? param.value : 0); if (param.data) { for (let i = 0; i < param.data.records.length; i++) { const record = param.data.records[i]; tip += "<br/>" + record.user_name } } return tip; } },
                visualMap: { pieces: [{ gte: 1, lt: 100, color: "#99d1f4" }], show: false },
                series: [{
                    type: "map", map: "china", zoom: 1.7, roam: true, top: 95,
                    scaleLimit: { min: 1, max: 5 },
                    itemStyle: { normal: { borderColor: "rgba(0, 0, 0, 0.5)", areaColor: "#d9fafe" } },
                    data: data
                }]
            });

            $("#bustrip-title").append("(" + personnel.bustrip.data.length + ")");
            $("#leave-title").append("(" + personnel.leave.data.length + ")");

            //加载数据表
            tableInsBustripUser.reload({ data: personnel.bustrip.data });
            tableInsBustrip.reload({ data: personnel.bustrip.data });
            tableInsLeave.reload({ data: personnel.leave.data });

            // , data: { ding_attendance: "1" }
            //去除出差，请假人员
            var users = [];
            var otherUsers = [];
            result.user.list.forEach(function (user) {
                if (user.ding_attendance === 1) {
                    var exist = false;
                    for (let j = 0; j < personnel.leave.data.length; j++) {
                        const element = personnel.leave.data[j];
                        if (user.id === element.user_id) {
                            exist = true;
                            break;
                        }
                    }
                    for (let j = 0; j < personnel.bustrip.data.length; j++) {
                        const element = personnel.bustrip.data[j];
                        if (user.id === element.user_id) {
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        users.push(user);
                    }
                } else {
                    otherUsers.push(user);
                }
            });

            request.post({
                url: "/dingtalk/attendance/sameDayAttendanceList",
                data: { users: JSON.stringify(users) },
                success: function (data) {
                    tableInsCompany.reload({ data: data });
                    tableInsNoattendance.reload({ data: otherUsers });
                }
            });
        }
    });

    //消息通知
    window.notice = function (ident) {
        if (ident === "leave" || ident === "bustrip") {
            window.location.reload();
        }
    }

    //对外输出
    exports("main", {});
});