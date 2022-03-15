"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    asynTreeSelectEx: "middleware/plugin/asynTreeSelect"
}).define(["base", "form", "asynTreeSelectEx"], async function (exports) {

    var setter = layui.setter;
    var common = layui.common;
    var form = layui.form;
    var asynTreeSelect = layui.asynTreeSelect;
    var request = layui.request;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    var user = layui.sessionData("session").user;

    //项目跟进状态
    var FollowStatus = await layui.base.dictionary(setter.dictionary.FollowStatus);
    FollowStatus.render({ elem: "[name='follow_status']" });

    //项目类型
    var ProjectType = await layui.base.dictionary(setter.dictionary.ProjectType);
    var ProjectTypeGroup = ProjectType.groupData();
    for (let i = 0; i < ProjectTypeGroup.length; i++) {
        const group = ProjectTypeGroup[i];
        $("[name='project_type']").append("<optgroup label='" + group.name + "'></optgroup>")
        for (let j = 0; j < group.data.length; j++) {
            const item = group.data[j];
            $("[label='" + group.name + "']").append("<option value='" + item.op_value + "'>" + item.dic_name + "</option>");
        }
    }

    form.render();

    var asynTreeSelectIns = asynTreeSelect.load({
        elem: '#region',
        url: "/sys/region/list",
        onClick: function (data) {
            var pid = data.pid;
            if (pid === "100000") {
                //省级
                $("[name='province']").val(data.id);
                $("[name='province_name']").val(data.name);

                amap.geocoder.getLocation(data.name, function (status, result) {
                    if (status === 'complete' && result.geocodes.length) {
                        amap.map.setZoomAndCenter(6, result.geocodes[0].location);
                    }
                });
            } else {
                const lastFourCode = pid.slice(-4);
                const lastTwoCode = pid.slice(-2);
                if (lastFourCode === "0000") {
                    //市级
                    $("[name='city']").val(data.id);
                    $("[name='city_name']").val(data.name);
                    //区级
                    $("[name='county']").val("");
                    $("[name='county_name']").val("");
                    //初始代码
                    $("[name='project_code']").val(data.id);
                    amap.geocoder.getLocation($("[name='province_name']").val() + "" + data.name, function (status, result) {
                        if (status === 'complete' && result.geocodes.length) {
                            amap.map.setZoomAndCenter(10, result.geocodes[0].location);
                        }
                    });
                    return;
                }
                if (lastTwoCode === "00") {
                    //区级
                    $("[name='county']").val(data.id);
                    $("[name='county_name']").val(data.name);
                    //初始代码
                    $("[name='project_code']").val(data.id);

                    amap.geocoder.getLocation($("[name='province_name']").val() + "" + $("[name='city_name']").val() + "" + data.name, function (status, result) {
                        if (status === 'complete' && result.geocodes.length) {
                            amap.map.setZoomAndCenter(13, result.geocodes[0].location);
                        }
                    });
                    return;
                }
            }
        }
    });

    var amap = {
        map: null,
        mouseTool: null,
        overlay: null,
        polyEditor: null,
        geocoder: null,
        mapClick: true,
        clear: function () {
            if (this.overlay) {
                this.map.remove(amap.overlay);
                this.overlay = null;
            }
        }
    }

    /**
     * 高德地图引用
     */
    amap.map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

    amap.map.on('click', function () {
        if (!amap.mapClick) {
            amap.mapClick = true;
            return;
        }
        if (amap.polyEditor) {
            amap.polyEditor.close();
        }
    });

    AMap.plugin(["AMap.MouseTool", "AMap.PolyEditor", "AMap.Geocoder", "AMap.Autocomplete", "AMap.PlaceSearch"], function () {//异步加载插件
        amap.mouseTool = new AMap.MouseTool(amap.map);
        amap.mouseTool.on('draw', function (e) {
            amap.overlay = e.obj;
            amap.polyEditor = new AMap.PolyEditor(amap.map, amap.overlay);
            amap.polyEditor.open();
            amap.overlay.on("click", function () {
                amap.mapClick = false;
                amap.polyEditor.open();
            });
            amap.mouseTool.close();

            $("#hander").addClass("BMapLib_hander_hover");
            $("#hander").removeClass("BMapLib_hander");
            $("#polygon").addClass("BMapLib_polygon");
            $("#polygon").removeClass("BMapLib_polygon_hover");
        })
        amap.geocoder = new AMap.Geocoder({
            city: "全国",
        });

        //输入提示
        var auto = new AMap.Autocomplete({ input: "tipinput" });
        var placeSearch = new AMap.PlaceSearch({
            map: amap.map
        });
        //注册监听，当选中某条记录时会触发
        AMap.event.addListener(auto, "select", function (e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);  //关键字查询查询
        });
    });

    $(".amap-logo").remove();
    $(".amap-copyright").remove();

    $("#polygon").click(function () {
        amap.clear();

        amap.mouseTool.polygon({
            strokeColor: "red",    //边线颜色。
            fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        });

        $("#hander").addClass("BMapLib_hander");
        $("#hander").removeClass("BMapLib_hander_hover");
        $("#polygon").addClass("BMapLib_polygon_hover");
        $("#polygon").removeClass("BMapLib_polygon");
    });

    $("[name='custom_name']").click(function () {
        openForm({
            title: "选择客户",
            content: "custom.html",
            area: ["1050px", "800px"],
            yes: function (data) {
                $("[name='custom_id']").val(data.id);
                $("[name='custom_name']").val(data.custom_name);
                $("[name='custom_address']").val(data.custom_address);

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

    //判断是否为编辑
    var id = $("[name='id']").val();
    if (id) {
        request.post({
            url: "/prj/info",
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

                amap.clear();
                var polygonArr = JSON.parse(data.geojson);
                amap.overlay = new AMap.Polygon({
                    map: amap.map,
                    path: polygonArr,//设置多边形边界路径
                    strokeColor: "red",    //边线颜色。
                    fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 3,       //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid' //边线的样式，solid或dashed。
                });
                amap.map.add(amap.overlay);
                amap.map.setFitView([amap.overlay]);
                setTimeout(function () {
                    amap.polyEditor = new AMap.PolyEditor(amap.map, amap.overlay);

                    amap.overlay.on("click", function () {
                        amap.mapClick = true;
                        amap.polyEditor.open();
                    });
                    $(".amap-logo").remove();
                    $(".amap-copyright").remove();
                }, 1000);
            }
        });
    } else {
        if (amap.geocoder) {
            //初始定位
            amap.geocoder.getLocation("中国", function (status, result) {
                if (status === 'complete' && result.geocodes.length) {
                    amap.map.setZoomAndCenter(4, result.geocodes[0].location);
                }
            });
        } else {
            setTimeout(function () {
                //初始定位
                amap.geocoder.getLocation("中国", function (status, result) {
                    if (status === 'complete' && result.geocodes.length) {
                        amap.map.setZoomAndCenter(4, result.geocodes[0].location);
                    }
                });

                $(".amap-logo").remove();
                $(".amap-copyright").remove();
            }, 1000);
        }
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {

        if (!amap.overlay) {
            //绘制区域
            layer.msg("请绘制区域！", { icon: 8 });
            return;
        }
        $("[name='geojson']").val(JSON.stringify(amap.overlay.toGeoJSON().geometry.coordinates[0]))

        common.submitForm({
            removeKeys: ["id", "project_code", "county", "county_name", "remark"],
            url: {
                update: "/prj/info/update"
            }
        }, callback);
    }

    //对外输出
    exports("main", {});
});