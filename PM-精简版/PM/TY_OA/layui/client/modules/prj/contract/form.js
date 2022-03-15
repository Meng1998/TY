"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tagsInput: "lib/tagsInput/tagsInput",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "laydate", "upload", "form", "layedit", "tagsInput"], async function (exports) {

    var laydate = layui.laydate;
    var common = layui.common;
    var layedit = layui.layedit;
    var table = layui.table;
    var upload = layui.upload;
    var verify = layui.verify;
    var request = layui.request;
    var util = layui.util;
    var form = layui.form;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    var LAY_PAYMENT_MANAGE = "LAY-payment-manage";

    //日期控件
    laydate.render({
        elem: "input[name='sign_time']"
    });

    //日期控件
    laydate.render({
        elem: "input[name='delivery_time']"
    });

    var remark = layedit.build("remark", {
        height: 200,
        tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink"]
    });

    $("#files").tagsInput({
        defaultText: "选择一个或多个文件..."
    });

    var currentFile = {};

    var uploadIns = upload.render({
        elem: "#choose",
        auto: false,
        multiple: true,
        accept: "file",
        choose: function (obj) {
            var files = this.files = obj.pushFile();
            obj.preview(function (index, file, result) {
                //判断重复文件
                for (var p in currentFile) {
                    if (currentFile[p].name === file.name) {
                        delete files[index];
                        layer.msg("文件已存在！", { icon: 8, anim: 6 });
                        return;
                    }
                }
                currentFile[index] = file;
                $("#files").addTag(file.name, {
                    focus: true,
                    unique: true,
                    index: index,
                    close: function (index) {
                        delete files[index];
                        delete currentFile[index];
                        uploadIns.config.elem.next()[0].value = '';
                    }
                });
            });
        }
    });

    var toolbarEvent = {
        add: function () {
            var data = table.cache[LAY_PAYMENT_MANAGE];
            data.push({
                term: "付款条件" + (data.length + 1),
                amount: "0"
            });
            tableIns.reload({
                data: data
            });
        },
        delete: function (row, index) {
            var data = table.cache[LAY_PAYMENT_MANAGE];
            data.splice(index, 1);
            tableIns.reload({
                data: data
            });
        }
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_PAYMENT_MANAGE,
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        page: false,
        totalRow: true,
        data: [],
        cols: [
            { type: "numbers" },
            { title: "付款条件", field: "term", align: "center", edit: "text", totalRowText: "合计", templet: function (row) { return common.table.textLeft(row.term); } },
            { title: "付款金额", field: "amount", align: "center", width: 100, edit: "number", totalRow: true }
        ],
        edit: function (obj) {
            //刷新数据
            tableIns.reload();
        }
    });

    window.submit = function (callback) {
        //计算金额
        var data = table.cache[LAY_PAYMENT_MANAGE];

        var sum = 0;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            sum += parseInt(item.amount);
        }
        if (sum !== parseInt($("[name='amount']").val())) {
            layer.msg("合同金额错误！", { icon: 2, anim: 6 });
            return;
        }

        $("[name='remark']").val(layedit.getContent(remark).replace(/\"/g, "'"));

        var field = form.val(LAY_FORM);
        delete field.file;
        var verifyData = util.clone(field, ["file", "remark"]);
        //非空验证
        if (!verify.execute(verifyData)) {
            return;
        }

        field.payment = JSON.stringify(data);

        //将数据转为FormData
        var formData = new FormData();
        for (var p in field) {
            formData.append(p, field[p]);
        }
        for (var p in currentFile) {
            formData.append(p, currentFile[p]);
        }

        request.post({
            url: "/prj/contract/create",
            method: "post",
            data: formData,
            mimeType: "multipart/form-data",
            timeout: 0,
            contentType: false,
            processData: false,
            layer: parentLayer,
            success: function (data) {
                callback("数据添加成功！");
            }
        });

    }

    //对外输出
    exports("main", {});
});