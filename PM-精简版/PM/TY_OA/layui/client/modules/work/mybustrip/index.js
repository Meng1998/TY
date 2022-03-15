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
    var setter = layui.setter;
    var request = layui.request;
    var common = layui.common;
    var form = layui.form;

    var LAY_BUSTRIP_MANAGE = "LAY-bustrip-manage";
    var user = layui.sessionData("session").user;

    //人员出差类型
    var BustripType = await layui.base.dictionary(setter.dictionary.BustripType);

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

    var toolbarEvent = {
        add: function () {
            openForm();
        },
        end: function (row) {
            if (row.end_time) {
                layer.msg("本次外勤已完成！", { icon: 8 });
                return;
            }
            common.openForm({
                id: row.id,
                title: "结束外勤",
                content: "end.html",
                area: ["538px", "518px"],
                row: row,
                fields: ["id"],
                yes: function () {
                    tableIns.reload();
                }
            })
        },
        delete: function (row) {
            if (row.end_time) {
                layer.msg("该数据无法删除！", { icon: 8 });
                return;
            }
            operation({
                row: row,
                confirm: "是否删除外勤信息？",
                url: "/work/bustrip/delete",
                data: { id: row.id },
                msg: "数据删除成功!"
            });
        }
    }

    function openForm() {
        layer.open({
            type: 2,
            title: "新建外勤",
            content: "add.html",
            area: ["450px", "717px"],
            btn: ["确定", "取消"],
            success: function (layero, index) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.parentLayer = layer;
                var body = layer.getChildFrame("body", index);
                body.find("[name='user_id']").val(user.id);
                body.find("[name='user_name']").val(user.full_name);
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.submit(function (msg) {
                    layer.msg(msg, { icon: 1 });
                    layer.close(index);
                    tableIns.reload();
                });
            }
        });
    }

    function operation(options) {
        if (options.row) {
            layer.confirm(options.confirm, {
                title: "提示"
            }, function () {
                request.post({
                    url: options.url,
                    data: options.data,
                    success: function (data) {
                        tableIns.reload();
                        layer.close(layer.index);
                        layer.msg(options.msg, { icon: 1 });
                    }
                });
            });
        } else {
            layer.msg("请选择数据！", { icon: 8 });
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_BUSTRIP_MANAGE,
        url: "/work/bustrip/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers", fixed: "left" },
            { title: "提交时间", field: "create_time", align: "center", width: 110, fixed: "left" },
            { title: "外勤事由", field: "excues", align: "center", width: 200, fixed: "left", templet: function (row) { return common.table.textLeft(row.excues); } },
            { title: "外勤类型", field: "type", align: "center", width: 100, fixed: "left", templet: function (row) { return BustripType.Formatter(row.type); } },
            { title: "起始时间", field: "start_time", align: "center", width: 110 },
            { title: "结束时间", field: "end_time", align: "center", width: 110 },
            { title: "项目名称", field: "project_name", align: "center", width: 280 },
            { title: "客户名称", field: "custom_name", align: "center", width: 300 },
            { title: "客户联系人", field: "contacts_name", align: "center", width: 120 },
            { title: "客户联系人电话", field: "contacts_tel", align: "center", width: 150 },
            { title: "所在位置", align: "center", width: 220, templet: function (row) { return common.formatRegion(row) } },
            { title: "备注", field: "remark", align: "center", width: 300, templet: function (row) { return common.table.textLeft(row.remark); } },
            { title: "当前状态", align: "center", width: 100, templet: function (row) { return row.end_time ? common.table.textBlue("已结束") : common.table.textGreen("出差中"); } },
            { title: "操作", width: 120, align: "center", fixed: "right", toolbar: "#tool" }
        ],
        fixed: { user_id: user.id }
    });

    //监听搜索
    form.on("submit(LAY-bustrip-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-bustrip-reset)", function (data) {
        tableIns.reset(data);
    });

    form.render();
    //对外输出
    exports("main", {});
});