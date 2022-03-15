"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table",//表格扩展
    clipboardEx: "middleware/lib/clipboard"//剪贴板扩展
}).define(["base", "tableEx", "clipboardEx", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var form = layui.form;
    var setter = layui.setter;
    var clipboardEx = layui.clipboardEx;
    var $ = layui.$;

    var LAY_AUTHORIZE_MANAGE = "LAY-authorize-manage";

    var user = layui.sessionData("session").user;

    //项目授权状态
    var AuthorizeStatus = await layui.base.dictionary(setter.dictionary.AuthorizeStatus);

    window.AuthorizeStatus = AuthorizeStatus;

    var toolbarEvent = {
        copy: function (row) {
            $(".font-primary").attr("data-clipboard-text", row.machine_id);
            clipboardEx.initialize('.font-primary');
        },
        upload: function (row) {
            common.openForm({
                id: row.id,
                title: "上传LICENCE",
                content: "form.html",
                area: ["550px", "476px"],
                row: row,
                yes: function () {
                    tableIns.reload();
                },
                fields: [
                    "id", "project_id", "project_name", "machine_id",
                    { dom: "authorizer_id", value: user.id },
                    { dom: "authorizer_name", value: user.full_name }
                ]
            })
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_AUTHORIZE_MANAGE,
        url: "/lic/authorize/list",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目名称", field: "project_name", align: "center", width: 320 },
            { title: "信息描述", field: "message", align: "left" },
            { title: "提交时间", field: "create_time", align: "center", width: 120 },
            { title: "机器码", field: "machine_id", align: "center", width: 200 },
            { title: "提交人", field: "creater_name", align: "center", width: 120 },
            { title: "授权状态", field: "authorize_status", align: "center", width: 90, templet: function (row) { return AuthorizeStatus.Formatter(row.authorize_status); } },
            { title: "起始时间", field: "start_time", align: "center", width: 120 },
            { title: "失效时间", field: "expire_time", align: "center", width: 120 },
            { title: "操作", width: 200, align: "center", toolbar: "#tool" }
        ]
    });

    //监听搜索
    form.on("submit(LAY-authorize-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-authorize-reset)", function (data) {
        tableIns.reset(data);
    });

    //对外输出
    exports("main", {});
});