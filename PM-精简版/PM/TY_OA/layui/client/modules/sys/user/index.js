"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    tableEx: "middleware/plugin/table"//表格扩展
}).define(["base", "tableEx", "form"], async function (exports) {

    var table = layui.table;
    var form = layui.form;
    var request = layui.request;
    var setter = layui.setter;

    var LAY_USER_MANAGE = "LAY-user-manage";

    //人员学历类型
    var EducationType = await layui.base.dictionary(setter.dictionary.EducationType);

    var user = layui.sessionData("session").user

    //#region 工具条事件

    var toolbarEvent = {
        add: function () {
            openForm({});
        },
        delete: function (row) {
            operation("/sys/user/delete", row, {
                prompt: "是否删除用户：" + row.full_name,
                success: "数据删除成功"
            });
        },
        edit: function (row) {
            if (row) {
                openForm({
                    id: row.id
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        reset: function (row) {
            operation("/sys/user/resetPwd", row, {
                prompt: "是否重置<strong>" + ((row) ? row.full_name : "") + "</strong>的密码？",
                success: "密码重置成功"
            });
        },
        contract: function (row) {
            if (row) {
                openForm({
                    title: "员工合同",
                    content: "contract.html",
                    area: ["390px", "550px"],
                    id: row.id
                });
            } else {
                layer.msg("请选择数据！", { icon: 8 });
            }
        },
        sync: function (row) {
            request.post({
                url: "/dingtalk/user/userByNameSimple",
                data: { user_name: row.full_name },
                success: function (data) {
                    request.post({
                        url: "/sys/user/update",
                        data: {
                            id: row.id,
                            ding_userid: data.userid
                        },
                        success: function (data) {
                            tableIns.reload();
                            layer.msg("数据修改成功！", { icon: 1 });
                        }
                    });
                },
                error: function (data) {
                    layer.msg("数据同步失败！", { icon: 8 });
                }
            });
        }
    }

    function openForm(options) {
        layer.open({
            type: 2,
            title: options.title ? options.title : "人员信息",
            content: options.content ? options.content : "form.html",
            area: options.area ? options.area : ["400px", "655px"],
            btn: ["确定", "取消"],
            success: function (layero, index) {
                if (options.id) {
                    var body = layer.getChildFrame("body", index);
                    body.find("[name='id']").val(options.id);
                }
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

    function operation(url, row, msg) {
        if (row) {
            layer.confirm(msg.prompt, {
                title: "提示"
            }, function () {
                request.post({
                    url: url,
                    data: { id: row.id },
                    success: function (data) {
                        tableIns.reload();
                        layer.close(layer.index);
                        layer.msg(msg.success);
                    }
                });
            });
        } else {
            layer.msg("请选择数据！", { icon: 8 });
        }
    }

    var field = [
        { type: "numbers", fixed: "left" },
        { title: "登录名", field: "user_name", align: "center", width: 90, fixed: "left" },
        { title: "真实姓名", field: "full_name", align: "center", width: 90, fixed: "left" },
        { title: "所属部门", field: "dept_name", align: "center", width: 120 },
        { title: "人员角色", field: "role_name", align: "center", width: 150 },
        { title: "联系电话", field: "user_tel", align: "center", width: 120 },
        { title: "入职时间", field: "entry_time", align: "center", width: 110 },
        { title: "薪资", field: "wages", align: "center", width: 70 },
        { title: "开户行", field: "bank", align: "center", width: 200 },
        { title: "银行卡号", field: "bankcard", align: "center", width: 220 },
        { title: "合同签订日期", field: "contract_sign", align: "center", width: 120 },
        { title: "合同终止日期", field: "contract_expire", align: "center", width: 120 },
        { title: "邮箱", field: "user_email", align: "center", width: 200 },
        { title: "QQ", field: "user_qq", align: "center", width: 150 },
        { title: "微信", field: "user_wechat", align: "center", width: 150 },
        { title: "生日", field: "birthday", align: "center", width: 100 },
        { title: "身份证号码", field: "identity_card", align: "center", width: 200 },
        { title: "紧急联系人", field: "emergency_contacts", align: "center", width: 120 },
        { title: "紧急联系人电话", field: "emergency_tel", align: "center", width: 140 },
        { title: "毕业院校", field: "university", align: "center", width: 200 },
        { title: "专业", field: "speciality", align: "center", width: 150 },
        { title: "学历", field: "education", align: "center", width: 80, templet: function (row) { return EducationType.Formatter(row.education); } },
        { title: "籍贯", field: "native_place", align: "center", width: 200 },
        { title: "钉钉账号", align: "center", fixed: "right", width: 90, toolbar: "#sync-tool" },
        { title: "考勤打卡", align: "center", fixed: "right", width: 95, toolbar: "#attendance-tool" },
        { title: "操作", width: 240, align: "center", fixed: "right", toolbar: "#tool" }
    ]

    if (user.role_id === setter.other.bus) {
        field.splice(7, 1);
    }

    /**
    * 初始化数据
    */
    var tableIns = table.load({
        elem: LAY_USER_MANAGE,
        url: "/sys/user/list",
        toolbar: "#toolbar",
        toolbarEvent: toolbarEvent,
        cols: field,
        fixed: { job_status: "1" }
    });

    //监听分配操作
    form.on('switch(attendance)', function (obj) {
        var data = {
            id: obj.value,
            ding_attendance: obj.elem.checked ? 1 : 0
        }

        request.post({
            url: "/sys/user/update",
            data: data,
            success: function (result) {
                layer.msg("保存成功！", { icon: 1 });
            }
        });
    });

    //监听搜索
    form.on("submit(LAY-user-search)", function (data) {
        tableIns.search(data);
        return false;
    });

    //监听重置
    form.on("submit(LAY-user-reset)", function (data) {
        tableIns.reset(data);
    });

    //对外输出
    exports("main", {});
});