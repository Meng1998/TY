"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    echartsEx: "middleware/lib/echarts",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "echartsEx"], async function (exports) {

    var request = layui.request;
    var echarts = layui.echarts;
    var setter = layui.setter;
    var table = layui.table
    var $ = layui.$;

    var LAY_INFO_MANAGE = "LAY-project-manage";

    //项目状态
    var ProjectStatus = await layui.base.dictionary(setter.dictionary.ProjectStatus);
    //项目合同状态
    var ContractStatus = await layui.base.dictionary(setter.dictionary.ContractStatus);

    var stateChart = echarts.initialize("stateChart");
    var numberChart = echarts.initialize("numberChart");
    var mapChart = echarts.initialize("mapChart");
    var mapChartType = [ProjectStatus["conduct"], ProjectStatus["finish"]];

    var prj_total = [];//项目总数：进行项目和完结项目，不包含过期项目
    var prj_follow = [];//跟进项目

    var province = "100000";

    /**
      * 初始化数据
      */
    var tableIns = table.load({
        elem: LAY_INFO_MANAGE,
        url: "/prj/info/list",
        height: "600",
        cols: [
            { type: "numbers" },
            { title: "项目名称", field: "project_name", align: "left" },
        ],
        where: { project_status: mapChartType }
    });


    request.when({
        //ajax请求
        deferreds: [
            { name: "distrib", url: "/mgr/project/distrib", data: { project_status: [ProjectStatus.getDic("follow", "dic_identity"), ProjectStatus.getDic("conduct", "dic_identity"), ProjectStatus.getDic("finish", "dic_identity")] } },//查询项目数量
            { name: "status", url: "/mgr/project/status" },
            { name: "contract", url: "/mgr/project/contract", data: { project_status: [ProjectStatus.conduct, ProjectStatus.finish] } },
            { name: "geoAtlas", url: "/getGeoAtlas", data: { code: province } }
        ],
        success: function (result) {

            //#region 当前项目状态

            var Legend = [];
            Legend.push(ProjectStatus.getDic("follow", "dic_identity").dic_name);
            Legend.push(ProjectStatus.getDic("conduct", "dic_identity").dic_name);
            Legend.push(ContractStatus.getDic("nosigned", "dic_identity").dic_name);
            Legend.push(ContractStatus.getDic("signed", "dic_identity").dic_name);

            var ProjectStatus_Current = [];
            ProjectStatus_Current.push(ProjectStatus.getDic("follow", "dic_identity"));
            ProjectStatus_Current.push(ProjectStatus.getDic("conduct", "dic_identity"));

            var ProjectStatusData = [];
            for (let i = 0; i < ProjectStatus_Current.length; i++) {
                const itemDic = ProjectStatus_Current[i];
                var exist = false;
                for (let j = 0; j < result.status.length; j++) {
                    const itemData = result.status[j];
                    if (itemDic.op_value === itemData.project_status) {
                        ProjectStatusData.push({
                            name: itemDic.dic_name,
                            value: itemData.value
                        });
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    ProjectStatusData.push({
                        name: itemDic.dic_name,
                        value: 0
                    });
                }
            }

            var ContractStatusData = [];
            for (let i = 0; i < result.contract.length; i++) {
                const item = result.contract[i];
                ContractStatusData.push({
                    name: ContractStatus.Formatter(item.contract_status, false),
                    value: item.value
                });
            }

            stateChart.render({
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c}" },
                legend: { orient: 'vertical', x: 'left', data: Legend },
                series: [
                    { name: '项目合同', type: 'pie', label: { position: 'inner', color: '#fff' }, labelLine: { show: true }, radius: ['0%', '45%'], center: ['50%', '50%'], data: ContractStatusData },
                    { name: '项目状态', type: 'pie', label: { formatter: '  {b|{b}：}{c}  ', backgroundColor: '#eee', borderColor: '#aaa', borderWidth: 1, borderRadius: 4, rich: { b: { fontSize: 14, lineHeight: 30 } } }, radius: ['55%', '75%'], center: ['50%', '50%'], data: ProjectStatusData }
                ]
            });

            //#endregion

            var category = [], follow = [], conduct = [], finish = [];
            for (let i = 0; i < result.distrib.length; i++) {
                const item = result.distrib[i];
                // if ((parseInt(item.conduct) + parseInt(item.finish)) > 0) {
                prj_total.push({ name: item.name, code: item.code, value: parseInt(item.conduct) + parseInt(item.finish) });
                // }
                // if (parseInt(item.follow) > 0) {
                prj_follow.push({ name: item.name, code: item.code, value: item.follow });
                // }
                category.push(item.name);
                follow.push(item.follow);
                conduct.push(item.conduct);
                finish.push(item.finish);
            }

            //#region 项目数量统计

            numberChart.setOption({
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                legend: { data: [ProjectStatus.getDic("follow", "dic_identity").dic_name, ProjectStatus.getDic("conduct", "dic_identity").dic_name, ProjectStatus.getDic("finish", "dic_identity").dic_name] },
                xAxis: { type: 'category', data: category, offset: 10, axisLabel: { interval: 0, rotate: 30 }, },
                yAxis: { type: 'value', boundaryGap: [0, 0.01] },
                series: [
                    { type: 'bar', name: ProjectStatus.getDic("follow", "dic_identity").dic_name, data: follow, stack: 'value' },
                    { type: 'bar', name: ProjectStatus.getDic("conduct", "dic_identity").dic_name, data: conduct, stack: 'value' },
                    { type: 'bar', name: ProjectStatus.getDic("finish", "dic_identity").dic_name, data: finish, stack: 'value' }
                ]
            });

            //#endregion

            //初始化地图数据
            echarts.registerMap("china", result.geoAtlas);

            //#region 项目分布

            mapChart.render({
                tooltip: {
                    formatter: function (e, t, n) { return e.name + "：" + (e.value ? e.value : 0) }
                },
                visualMap: [{
                    min: 0, max: 50, left: 26, bottom: 40, showLabel: !0, text: ["高", "低"], show: !0,
                    pieces: [
                        { gt: 50, label: "> 50", color: "#2083e2" },
                        { gte: 10, lte: 50, label: "10 - 50", color: "#66b0ed" },
                        { gte: 1, lt: 10, label: "1 - 9", color: "#99d1f4" },
                        { value: 0, color: "#d9fafe" }
                    ]
                }],
                series: [{
                    type: "map", map: "china", zoom: 1.7, roam: true, top: 180,
                    itemStyle: { normal: { borderColor: "rgba(0, 0, 0, 0.5)", areaColor: "#d9fafe" } },
                    label: { normal: { show: true, color: "#640000" }, },
                    data: prj_total
                }]
            });

            mapChart.click(function (data) {
                if (data && data.code) {
                    $("#province").show().html(data.name);
                    province = data.code;
                } else {
                    province = "-1";
                }
                tableIns.reload({ where: { province: province, project_status: mapChartType } });
            });

            $("#info").html("全国：")

            //#endregion
        }
    });

    var active = {
        total: function () {
            mapChartType = [ProjectStatus["conduct"], ProjectStatus["finish"]];
            mapChart.reload({
                visualMap: [{ pieces: [{ color: "#2083e2" }, { color: "#66b0ed" }, { color: "#99d1f4" }, { color: "#d9fafe" }] }],
                series: [{ itemStyle: { normal: { areaColor: "#d9fafe" } }, data: prj_total }]
            }, ["series.0.data"]);
        },
        follow: function () {
            mapChartType = ProjectStatus["follow"];
            mapChart.reload({
                visualMap: [{ pieces: [{ color: "#00662c" }, { color: "#41a06a" }, { color: "#6ed59a" }, { color: "#bcedd1" }] }],
                series: [{ itemStyle: { normal: { areaColor: "#bcedd1" } }, data: prj_follow }]
            }, ["series.0.data"]);
        },
        china: function () {
            province = "";
            $("#province").hide();
        }
    }

    $(".layui-btn").on("click", function () {
        var type = $(this).data("type");
        active[type] && active[type].call(this);
        tableIns.reload({ where: { province: (province === "100000") ? null : province, project_status: mapChartType } });
    });
 
    //消息通知
    window.notice = function (ident) {
        if (ident === "project") {
            window.location.reload();
        }
    }

    //对外输出
    exports("main", {});
});