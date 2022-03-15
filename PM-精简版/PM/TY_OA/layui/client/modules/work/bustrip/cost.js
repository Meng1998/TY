"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var setter = layui.setter;
    var common = layui.common;
    var form = layui.form;
    var $ = layui.$;

    var LAY_TRAFFIC_MANAGE = "LAY-traffic-manage";

    var toolbarEvent = {
        "traffic-delete": function (row, obj) {
            var index = obj.tr.data("index");
            //判断是否为最后一行
            var data = table.cache[LAY_TRAFFIC_MANAGE];
            data.splice(index, 1);
            if (data.length === 0) {
                data.push({});
            }
            tableInsTraffic.reload({
                data: data
            });
        }
    }

    //交通工具
    var VehicleType = await layui.base.dictionary(setter.dictionary.VehicleType);

    /**
    * 初始化数据
    */
    var tableInsTraffic = table.load({
        elem: LAY_TRAFFIC_MANAGE,
        toolbarEvent: toolbarEvent,
        page: false,
        row: false,
        height: "full-250",
        data: [{}],
        totalRow: true,
        theads: [
            [
                { type: "numbers", title: "序号", rowspan: 2 },
                { title: "出发", align: "center", colspan: 3 },
                { title: "到达", align: "center", colspan: 3 },
                {
                    title: "交通工具", field: "vehicle_type", align: "center", width: 120, rowspan: 2,
                    templet: function (row) {
                        var html = "<select name='vehicle_type' lay-filter='vehicle_type' data-value='" + row.vehicle_type + "'>";
                        html += "<option value=''>请选择</option>";
                        for (let i = 0; i < VehicleType.list.length; i++) {
                            const dic = VehicleType.list[i];
                            html += "<option value='" + dic.op_value + "'>" + dic.dic_name + "</option>";
                        }
                        return html;
                    }
                },
                { title: "交通费", align: "center", colspan: 2 },
                { title: "操作", align: "center", rowspan: 2, width: 70, toolbar: "#tool" }
            ],
            [
                { title: "月", field: "depart_month", align: "center", width: 60, edit: "number" },
                { title: "日", field: "depart_day", align: "center", width: 60, edit: "number" },
                { title: "地点", field: "depart_place", align: "center", edit: "text" },
                { title: "月", field: "arrive_month", align: "center", width: 60, edit: "number" },
                { title: "日", field: "arrive_day", align: "center", width: 60, edit: "number" },
                { title: "地点", field: "arrive_place", align: "center", edit: "text" },
                { title: "单据张数", field: "bill_num", align: "center", width: 90, edit: "number" },
                { title: "金额", field: "amount", align: "center", width: 90, edit: "number", totalRow: true },
            ]
        ],
        done: function (instance, options) {
            var tableElem = instance.elem.next('.layui-table-view');
            var count = options.count;
            count || tableElem.find('.layui-table-header').css('overflow', 'auto');
            layui.each(tableElem.find('select'), function (index, item) {
                var elem = $(item);
                elem.val(elem.data('value')).parents('div.layui-table-cell').css('overflow', 'visible');
            });
            form.render();
        },
        edit: function (obj) {
            var index = obj.tr.data("index");//当前行下标
            var data = table.cache[LAY_TRAFFIC_MANAGE];
            //判断是否为最后一行
            if (index === (data.length - 1)) {
                //添加一行
                data.push({});
            }
            tableInsTraffic.reload({
                data: data
            });
        }
    });

    form.on("select(vehicle_type)", function (data) {
        var elem = $(data.elem);
        var trElem = elem.parents("tr");
        var tableData = table.cache[LAY_TRAFFIC_MANAGE];
        var index = trElem.data("index");//当前行下标 
        // 更新到表格的缓存数据中，才能在获得选中行等等其他的方法中得到更新之后的值
        tableData[index][elem.attr("name")] = data.value;

        //判断是否为最后一行
        if (index === (tableData.length - 1)) {
            //添加一行
            tableData.push({});
            tableInsTraffic.reload({
                data: tableData
            });
        }
    });

    //对外输出
    exports("main", {});
});