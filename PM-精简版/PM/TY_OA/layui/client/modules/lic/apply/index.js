"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var common = layui.common;
    var request = layui.request;
    var form = layui.form;
    var setter = layui.setter;

    var user = layui.sessionData("session").user;

    var LAY_AUTHORIZE_MANAGE = "LAY-authorize-manage";

    //人员学历类型
    var AuthorizeStatus = await layui.base.dictionary(setter.dictionary.AuthorizeStatus);

    window.AuthorizeStatus = AuthorizeStatus;

    var toolbarEvent = {
        add: function () {
            common.openForm({
                title: "授权信息",
                content: "form.html",
                area: ["550px", "346px"],
                yes: function () {
                    tableIns.reload();
                },
                fields: [{ dom: "creater_id", value: user.id }, { dom: "creater_name", value: user.full_name }]
            });
        },
        delete: function (row) {
            common.operation({
                url: "/lic/authorize/delete",
                data: { id: row.id },
                success: function (data) {
                    tableIns.reload();
                }
            }, row, {
                prompt: "是否删除授权申请：<font color='#0000FF' style='cursor:pointer'>" + row.project_name + "</font>？",
                success: "数据删除成功！"
            });
        },
        download: function (row) {
            //获取下载路径
            request.post({
                url: "/lic/authorize/download",
                data: { id: row.id },
                success: function (result) {
                    window.open(result.address);
                }
            });
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_AUTHORIZE_MANAGE,
        url: "/lic/authorize/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: [
            { type: "numbers" },
            { title: "项目名称", field: "project_name", align: "center", width: 320 },
            { title: "信息描述", field: "message", align: "left" },
            { title: "提交时间", field: "create_time", align: "center", width: 120 },
            { title: "授权状态", field: "authorize_status", align: "center", width: 90, templet: function (row) { return AuthorizeStatus.Formatter(row.authorize_status); } },
            { title: "起始时间", field: "start_time", align: "center", width: 120 },
            { title: "失效时间", field: "expire_time", align: "center", width: 120 },
            { title: "操作", width: 120, align: "center", toolbar: "#tool" }
        ],
        fixed: { creater_id: user.id }
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