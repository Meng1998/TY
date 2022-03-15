"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    echartsEx: "middleware/lib/echarts"
}).define(["base", "laytpl", "echartsEx"], function (exports) {

    var setter = layui.setter;
    var laytpl = layui.laytpl;
    var echarts = layui.echarts;
    var $ = layui.$;

    var SOCKET_URL = setter.uri[setter.uri.environment].maintain
    var websocket = new ReconnectingWebSocket(SOCKET_URL);
    var processorChart = echarts.initialize("processor_chart");
    var memoryChart = echarts.initialize("memory_chart");

    processorChart.setOption(chartOption("CPU", "0.0%"), true);
    memoryChart.setOption(chartOption("内存", "0.0%"), true);

    // chartOption("CPU");
    // 随机数据
    // function numb() {
    //     data = Math.floor(Math.random() * 100);
    //     option.title[0].text = 'CPU';
    //     option.title[1].text = data + "%";
    //     option.series[0].data[0].value = data;
    //     processorChart.setOption(option, true);
    // }

    // setInterval(function () {
    //     numb();
    // }, 1000);

    websocket.onopen = function () {
        console.log("connect success!");
        //订阅消息
        websocket.send("subscribe");
    }

    websocket.onmessage = function (messageEvent) {
        var data = messageEvent.data;
        var origin = messageEvent.origin;
        if (data === "subscribe success") {
            console.log(data);
        } else if (data === "subscribe error") {
            console.log(data);
        } else {
            var recive;
            try {
                recive = JSON.parse(data);
            } catch (e) {
                debugger;
            }
            var ident = recive.ident;
            var body = recive.body;
            switch (ident) {
                case "basic":
                    $("#system_container").html(laytpl(system.innerHTML).render(body));
                    $("#network_container").html(laytpl(network.innerHTML).render(body));
                    $("#active").html(body.os.uptime.UTCToBeiJing("yyyy年MM月dd日"));
                    $("#processor_btn").html(body.cpu);
                    $("#free_mem").html(body.total_mem);
                    break;
                default:
                    $("#current").html(body.uptimey.current.UTCToBeiJing());
                    $("#seconds").html(body.uptimey.uptime.seconds);
                    $("#minutes").html(body.uptimey.uptime.minutes);
                    $("#hours").html(body.uptimey.uptime.hours);
                    $("#days").html(body.uptimey.uptime.days);

                    processorChart.setOption(chartOption("CPU", body.advanced.cpu_usage.replace("%", "")), true);
                    memoryChart.setOption(chartOption("内存", body.advanced.mem_usage.replace("%", "")), true);
                    $("#used_mem").html("已用内存：" + body.advanced.used_mem);
                    $("#free_mem").html("可用内存：" + body.advanced.free_mem);

                    $("#notice_user").empty();
                    for (let i = 0; i < body.users.length; i++) {
                        const loguser = body.users[i];
                        $("#notice_user").append(addUserList(loguser.user));
                    }
                    console.log(data);
                    break;
            }
        }
    }

    function addUserList(user) {
        var templet = "";
        templet += "<div class='layui-col-sm12'>";
        templet += "<div class='data-group'>";
        templet += "<div class='layui-row layui-col-space15'>";
        templet += "<div class='layui-col-sm3'>";
        if (user.head_img) {
            templet += "<img class='data-header' src='" + user.head_img + "' />";
        } else {
            templet += "<img class='data-header' src='../../../img/head.png' />";
        }
        templet += "</div>";
        templet += "<div class='layui-col-sm9'>";
        templet += "<div class='layui-row layui-col-space15' style='height: 64px; line-height: 64px;'>";
        templet += "<div class='layui-col-sm12'>";
        templet += "<span class='layui-name-label'>" + user.full_name + "</span>";
        templet += "</div>";
        templet += "<div class='layui-col-sm12'>";
        templet += "<span class='layui-role-label'>" + user.role_name + "</span>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        templet += "</div>";
        return templet;
    }

    function chartOption(text, data) {
        return {
            backgroundColor: 'transparent',
            title: [
                { text: text, x: 'center', top: '70%', textStyle: { color: '#be8c3c', fontSize: 22, } },
                { text: data + "%", x: 'center', top: '45%', textStyle: { color: '#be8c3c', fontSize: 26 } }
            ],
            // 极坐标系
            polar: { radius: ['39%', '51%'], center: ['50%', '50%'], },
            // 极坐标系：角度轴
            angleAxis: { max: 100 * 360 / 270, show: false, type: 'value', startAngle: 225 },
            // 极坐标系：径向轴
            radiusAxis: {
                type: 'category',
                show: true,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [
                // 第一层：中心文字展示区
                {
                    type: 'pie',
                    radius: ['0%', '35%'],
                    hoverAnimation: false,
                    cursor: 'auto',
                    itemStyle: {
                        normal: {
                            labelLine: { show: false },
                            color: {
                                type: 'radial', x: 0.5, y: 0.5, r: 0.5,
                                colorStops: [
                                    { offset: 0, color: '#08385c' },
                                    { offset: 1, color: '#08385c' }
                                ]
                            }
                        }
                    },
                    data: [{ value: 100 }],
                    z: 2
                },
                // 第二层：数据以进度条的形式展示
                {
                    type: 'bar',
                    data: [{ value: data }],
                    itemStyle: {
                        color: function () {
                            let obj = {
                                type: 'linear', x: 0, y: 0.5, x2: 1, y2: 0,
                                colorStops: [
                                    { offset: 0, color: '#8ac4d4' },
                                    { offset: 1, color: '#ec5e26' }
                                ]
                            };

                            if (data >= 0 && data < 20) {
                                obj.colorStops[1].color = '#8ac4d4';
                            } else if (data >= 20 && data < 40) {
                                obj.y = 0.3;
                                obj.x2 = 2;
                            } else if (data >= 40 && data < 60) {
                                obj.y = 0.3;
                                obj.x2 = 1.5;
                            } else if (data >= 60 && data < 80) {
                                obj.y = 0.4;
                                obj.x2 = 1.1;
                            }
                            return obj;
                        }
                    },
                    barGap: '-100%', coordinateSystem: 'polar', roundCap: true, cursor: 'auto', z: 4
                },
                // 第二层：进度条背景
                {
                    type: 'bar',
                    data: [{ value: 100, }],
                    itemStyle: { color: '#013f72' },
                    barGap: '-100%',
                    coordinateSystem: 'polar',
                    roundCap: true,
                    cursor: 'auto',
                    emphasis: { itemStyle: { color: '#013f72' } },
                    z: 3
                },
                // 第三层；仪表盘：只显示刻度
                {
                    type: 'gauge',
                    radius: '80%',
                    startAngle: '225',
                    endAngle: '-45',
                    splitNumber: 10,
                    pointer: { show: false },
                    title: { show: false },
                    detail: { show: false },
                    data: [{ value: 100, name: '' }],
                    axisLine: { lineStyle: { width: 20, color: [[0, '#5fa7ca'], [1, '#5fa7ca']], opacity: 0 } },
                    axisTick: { length: 10, lineStyle: { color: 'auto' } },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    z: 5
                },
                // 第四层；背景圆：带阴影
                {
                    type: 'pie',
                    radius: ['0%', '70%'],
                    hoverAnimation: false,
                    cursor: 'auto',
                    itemStyle: { color: { type: 'radial', x: 0.5, y: 0.5, r: 0.5, colorStops: [{ offset: 0, color: '#002e50' }, { offset: 0.9, color: '#002e50' }, { offset: 1, color: '#134568' }] } },
                    data: [{ value: 100 }],
                    labelLine: { show: false },
                    z: -1
                },
                // 第五层：视觉上类似于边框，带阴影
                {
                    type: 'pie',
                    radius: ['0', '70.4%'],
                    hoverAnimation: false,
                    cursor: 'auto',
                    itemStyle: { color: '#146a90', shadowBlur: 50, shadowColor: '#146a90' },
                    data: [{ value: 100 }],
                    labelLine: { show: false },
                    emphasis: { itemStyle: { color: '#146a90' } },
                    z: -2
                }
            ]
        };
    }

    //对外输出
    exports("main", {});
});