"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "upload", "form", "laydate"], async function (exports) {

    var form = layui.form;
    var setter = layui.setter;
    var laydate = layui.laydate;
    var request = layui.request;
    var upload = layui.upload;
    var $ = layui.$;

    var LAY_FORM = "LAY-form";

    //人员学历类型
    var EducationType = await layui.base.dictionary(setter.dictionary.EducationType);
    EducationType.render({ elem: "[name='education']" });

    //日期控件
    laydate.render({
        elem: "input[name='birthday']"
    });

    upload.render({
        elem: "#head_img",
        auto: false,
        accept: "images",
        acceptMime: "image/*",
        size: 1024,
        choose: function (obj) {
            obj.preview(function (index, file, result) {
                $("#head_img").attr("src", result);
            });
        }
    });

    //判断是否为编辑
    var user = layui.sessionData("session").user
    if (user) {
        request.post({
            url: "/sys/user",
            data: { id: user.id },
            success: function (data) {
                if (user.head_img) {
                    $("#head_img").attr("src", data.head_img);
                }
                $("#full_name").html(data.full_name);
                $("#user_name").html(data.user_name);
                $("#dept_name").html(data.dept_name);
                $("#role_name").html(data.role_name);
                $("#entry_time").html(data.entry_time);

                form.val(LAY_FORM, data);
            }
        });
    }

    /**
     * 提交数据
     */
    window.submit = function (callback) {
        var field = form.val(LAY_FORM);
        field.head_img = $("#head_img").attr("src");

        request.post({
            url: "/sys/user/update",
            data: field,
            success: function (data) {
                //浏览器存储
                layui.sessionData("session", { key: "user", value: data });
                if (callback) {
                    callback("信息修改成功");
                }
            }
        });
    }

    //对外输出
    exports("main", {});
});