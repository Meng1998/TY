"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "upload", "laydate", "form"], async function (exports) {

    var request = layui.request;
    var form = layui.form;
    var upload = layui.upload;
    var $ = layui.$;
    var laydate = layui.laydate;

    var LAY_FORM = "LAY-form";

    laydate.render({
        elem: "input[name='start_time']",
        trigger: "click",
        type: 'date',
        done: function (value, date) {
            //更新结束日期的最小日期
            expire_time.config.min = lay.extend({}, date, {
                month: date.month - 1
            });

            //自动弹出结束日期的选择器
            expire_time.config.elem[0].focus();
        }
    });

    var expire_time = laydate.render({
        elem: "input[name='expire_time']",
        type: 'date',
        trigger: "click"
    });

    //拖拽上传
    var uploadIns = upload.render({
        elem: "#upload",
        accept: "file",//普通文件
        exts: "lic",//只允许上传压缩文件
        auto: false,
        choose: function (obj) {
            $("i").removeClass("layui-icon-upload");
            $("i").addClass("fa fa-file-text-o");

            obj.preview(function (index, file, result) {
                //判断重复文件
                uploadIns.file = file;
                $("p").html(file.name);
            });
        }
    });

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        if (!uploadIns.file) {

            layer.msg("请选择文件！", { icon: 8, anim: 6 });
            return;
        }
        var field = form.val(LAY_FORM);
        delete field.file;

        //将数据转为FormData
        var formData = new FormData();
        for (var p in field) {
            formData.append(p, field[p]);
        }

        formData.append(uploadIns.file, uploadIns.file);

        request.post({
            url: "/lic/authorize/upload",
            method: "post",
            data: formData,
            mimeType: "multipart/form-data",
            timeout: 0,
            contentType: false,
            processData: false,
            layer: parentLayer,
            success: function (data) {
                callback("授权文件上传成功！");
            }
        });
    }

    //对外输出
    exports("main", {});
});