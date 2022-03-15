"use script";

/**
 * 扩展Echarts方法
 */
layui.extend({
    echarts: "lib/echarts/echarts"
}).define("echarts", function (exports) {

    var $ = layui.$;

    var charts = [];

    layui.echarts.initialize = function (elem) {
        var chart = layui.echarts.init(document.getElementById(elem));
        //点击事件
        chart.click = function (callback) {
            chart.on('click', function (param) {
                callback(param.data, param);
            });
        }
        chart.canvasClick = function (callback) {
            chart.getZr().on('click', function (param) {
                callback(param.target, param);
                return false;
            });
        }
        chart.render = function (options) {
            this.setOption(options);
        }
        chart.reload = function (data, fields) {
            var option = this.getOption();
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                var arr = field.split('.');
                switch (arr.length) {
                    case 1:
                        option[arr[0]] = {}
                        break;
                    case 2:
                        option[arr[0]][arr[1]] = {}
                        break;
                    case 3:
                        option[arr[0]][arr[1]][arr[2]] = {}
                        break;
                    case 4:
                        option[arr[0]][arr[1]][arr[2]][arr[3]] = {}
                        break;
                }
            }

            $.extend(true, option, data);
            this.setOption(option, true);
        }

        charts.push(chart);

        return chart;
    }

    $(window).on("resize", function () {
        charts.forEach(chart => {
            chart.resize();
        });
    });

    exports("echartsEx", layui.echarts);
});