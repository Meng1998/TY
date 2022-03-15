"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    socket: "middleware/socket",
    noticeEx: "middleware/lib/notice",
    frame: "modules/frame"
}).define(["base", "noticeEx", "frame"], function (exports) {

    var element = layui.element;//常用元素操作：element
    var layer = layui.layer;//常用元素操作：layer
    var frame = layui.frame;
    var request = layui.request;
    var setter = layui.setter;
    var base = layui.base;
    var laytpl = layui.laytpl;
    var $ = layui.$;

    var SIDE_MENU = "#LAY-system-side-menu";//Menu菜单

    var user = layui.sessionData("session").user
    if (user) {
        //设置用户名
        $("#loginUser").append(user.full_name);
        if (user.head_img) {
            $("#headImg").attr("src", user.head_img);
        }
    }

    // var SOCKET_URL = "";//API服务地址
    // if (setter.uri.debug) {
    //     SOCKET_URL = setter.uri.DEV.socket;
    // } else {
    //     SOCKET_URL = setter.uri.PRD.socket;
    // }
    var SOCKET_URL = setter.uri[setter.uri.environment].socket
    frame.socket.init(SOCKET_URL, user);

    $("[layadmin-event='password']").after(laytpl(changeuser.innerHTML).render({}));


    request.post({
        url: "/sys/role",
        data: { id: user.role_id },
        success: function (result) {
            //加载首页工作台
            $("iframe").attr("src", result.workbench);
        }
    });

    /**
     * 加载菜单
     */
    request.post({
        url: "/sys/action/actionByRole",
        data: { role_id: user.role_id },
        success: function (result) {
            var list = result;
            var html = "";
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.children) {
                    html += "<li data-name='" + item.action_intent + "' class='layui-nav-item'>";
                    html += "<a href='javascript:void(0);' lay-tips='" + item.action_name + "' lay-direction='2'>";
                    html += "<i class='" + item.action_icon + "'></i>";
                    html += "<cite style='position:absolute;left:35px'>&nbsp;&nbsp;" + item.action_name + "</cite>";
                    html += "</a>";
                    html += "<dl class='layui-nav-child'>";

                    for (let j = 0; j < item.children.length; j++) {
                        const child = item.children[j];
                        html += "<dd data-name='" + item.action_intent + "'>";
                        html += "<a lay-href='" + child.action_intent + "' lay-icon='" + child.action_icon + "' lay-text='" + child.action_name + "' lay-ident='" + child.ident + "'>";
                        html += "<i class='" + child.action_icon + "' style='font-size:16px; width:16px; height: 16px;text-align:center;'>";
                        if (child.action_icon.indexOf("fa") >= 0) {
                            html += "<cite style='position:absolute;left:45px;top:13px'>&nbsp;&nbsp;" + child.action_name + "</cite>";
                        } else {
                            html += "<cite style='position:absolute;left:45px'>&nbsp;&nbsp;" + child.action_name + "</cite>";
                        }
                        html += "</i>";
                        html += "</a>";
                        html += "</dd>";
                    }
                    html += "</dl>";
                    html += "</li>";
                }
            }
            $(SIDE_MENU).append(html);
            //重新渲染
            element.init();
        },
        complete: function () {
            if (user.user_pwd === "123456") {
                //询问框
                layer.confirm("当前账号存在风险！</br>是否设置<strong>新密码</strong>？", {
                    title: "提示"
                }, function () {
                    layer.close(layer.index);
                    frame.events.password();
                });
            }
        }
    });

    /**
     * 退出登录
     */
    frame.events.logout = function () {
        layui.sessionData("session", null); //删除test表
        base.logout();
    }

    /**
     * 个人信息
     */
    frame.events.userinfo = function () {
        layer.open({
            type: 2,
            title: "个人信息",
            content: "sys/user/personal.html",
            area: ["770px", "781px"],
            btn: ["确定", "取消"],
            yes: function (index, layero) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.submit(function (msg) {
                    layer.msg(msg, { icon: 1 });
                    layer.close(index);
                    var user = layui.sessionData("session").user
                    if (user) {
                        if (user.head_img) {
                            $("#headImg").attr("src", user.head_img);
                        }
                    }
                });
            }
        });
    }

    frame.events.changeuser = function () {
        layer.prompt({ title: "请输入用户", formType: 3 }, function (text, index) {
            //获取登录用户
            request.post({
                url: "/sys/user/login",
                data: {
                    user_name: text,
                    user_pwd: user.user_pwd
                },
                success: function (result) {
                    var user = result;
                    var local = layui.data("local");
                    if (local.user && local.user.remember) {
                        //本地存储
                        layui.data("local", { key: "user", value: { remember: true, user_name: user.user_name, user_pwd: user.user_pwd } });
                    }
                    //浏览器存储
                    layui.sessionData("session", { key: "user", value: user });
                    layer.close(index);
                    //页面跳转
                    base.page.href("index");
                }
            });
        });
    }

    /**
     * 修改密码
     */
    frame.events.password = function () {
        layer.open({
            type: 2,
            title: "修改密码",
            content: "sys/user/password.html",
            area: ["400px", "337px"],
            btn: ["确定", "取消"],
            yes: function (index, layero) {
                var iframeWin = window[layero.find("iframe")[0]["name"]];
                iframeWin.submit(function (msg) {
                    layer.msg(msg, {}, function () {
                        frame.events.logout();
                    });
                    layer.close(index);
                });
            }
        });
    }

    /**
     * socket接收数据
     * @param {string} data 接收数据
     */
    frame.socket.onmessage = function (data) {
        var tabsbodys = $("#LAY_app_body").children();
        if (window.layui.setter.debug) {
            console.log(JSON.parse(data));
        }
        var recive = JSON.parse(data);//接收数据
        if (recive.ident === "login" && recive.body.code === 0 && recive.body.data.id === user.id) {
            //关闭websocket连接
            frame.socket.close();
            layer.alert("账号已在另一地点登录。", {
                title: "下线通知",
                icon: 8
            }, function () {
                frame.events.logout();
            });
            return;
        }
        for (let i = 0; i < tabsbodys.length; i++) {
            const tabsbody = tabsbodys[i];
            var type = $(tabsbody).data("type");//页面类型
            if (type) {
                var arr = type.split(",");
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    if (item === recive.ident) {
                        //Tab控制
                        var iframe = $(tabsbody).find(".layadmin-iframe");
                        if (iframe[0].contentWindow.notice) {
                            iframe[0].contentWindow.notice(item);
                        }
                        //Tab页子页控制
                        var childIframes = iframe.contents().find("iframe");
                        for (let j = 0; j < childIframes.length; j++) {
                            const childIframe = childIframes[j];
                            if (childIframe.contentWindow.notice) {
                                childIframe.contentWindow.notice(item);
                            }
                        }
                    }
                }
            } else {
                var id = $(tabsbody).attr("id");
                if (id === "home") {
                    //主页控制
                    var iframe = $(tabsbody).find(".layadmin-iframe");
                    if (iframe[0].contentWindow.notice) {
                        iframe[0].contentWindow.notice(recive.ident);
                    }
                }
            }
        }
    }

    //对外输出
    exports("main", {});
});