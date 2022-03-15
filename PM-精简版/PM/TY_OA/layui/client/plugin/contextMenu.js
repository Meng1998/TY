/** 右键菜单模块 date:2019-02-08   License By http://easyweb.vip */
layui.define(["jquery"], function (exports) {
    var $ = layui.jquery;
    var contextMenu = {
        bind: function (elem, menu) {
            $(elem).bind("contextmenu", function (event) {
                contextMenu.show(menu, event.clientX, event.clientY);
                return false
            });
        },
        show: function (menu, clientX, clientY, h) {
            //--------------------
            var offset = "left: " + clientX + "px; top: " + clientY + "px;";
            var html = '<div class="ctxMenu" style="' + offset + '">';
            html += contextMenu.getHtml(menu, "");
            html += "   </div>";
            contextMenu.remove();
            $("body").append(html);
            var ctxMenu = $(".ctxMenu");
            if (clientX + ctxMenu.outerWidth() > contextMenu.getPageWidth()) {
                clientX -= ctxMenu.outerWidth()
            }
            if (clientY + ctxMenu.outerHeight() > contextMenu.getPageHeight()) {
                clientY = clientY - ctxMenu.outerHeight();
                if (clientY < 0) {
                    clientY = 0
                }
            }
            ctxMenu.css({ "top": clientY, "left": clientX });
            contextMenu.setEvents(menu, h);
            $(".ctxMenu-item").on("mouseenter", function (p) {
                p.stopPropagation(); $(this).parent().find(".ctxMenu-sub").css("display", "none");
                if (!$(this).hasClass("haveMore")) { return } var l = $(this).find(">a");
                var m = $(this).find(">.ctxMenu-sub");
                var o = l.offset().top - $("body,html").scrollTop();
                var n = l.offset().left + l.outerWidth() - $("body,html").scrollLeft();
                if (n + m.outerWidth() > contextMenu.getPageWidth()) {
                    n = l.offset().left - m.outerWidth()
                }
                if (o + m.outerHeight() > contextMenu.getPageHeight()) {
                    o = o - m.outerHeight() + l.outerHeight(); if (o < 0) { o = 0 }
                }
                $(this).find(">.ctxMenu-sub").css({ "top": o, "left": n, "display": "block" })
            });
            $(".ctxMenu").on("mouseleave", function () {
                setTimeout(() => {
                    contextMenu.remove();
                }, 500);
            });
        },
        remove: function () {
            contextMenu.getThis().remove();
        },
        getThis: function () {
            return layui.jquery("body>.ctxMenu");
        },
        setEvents: function (menus, f) {
            $(".ctxMenu").off("click").on("click", "[lay-id]", function (event) {
                var othis = $(this).attr("lay-id");
                var menubtn = getMenubtn(othis, menus);
                menubtn.click && menubtn.click(event, f)
            });
            function getMenubtn(l, menus) {
                for (var i = 0; i < menus.length; i++) {
                    var menu = menus[i];
                    if (l == menu.itemId) {
                        return menu;
                    } else {
                        if (menu.subs && menu.subs.length > 0) {
                            var g = getMenubtn(l, menu.subs);
                            if (g) {
                                return g
                            }
                        }
                    }
                }
            }
        },
        getHtml: function (menus, d) {
            var html = "";
            for (var i = 0; i < menus.length; i++) {
                var menu = menus[i];
                menu.itemId = "ctxMenu-" + d + i;
                if (menu.subs && menu.subs.length > 0) {
                    html += '<div class="ctxMenu-item haveMore" lay-id="' + menu.itemId + '">';
                    html += "<a>";
                    if (menu.icon) {
                        html += '<i class="' + menu.icon + ' ctx-icon"></i>';
                    }
                    html += menu.name;
                    html += '<i class="layui-icon layui-icon-right icon-more"></i>';
                    html += "</a>";
                    html += '<div class="ctxMenu-sub" style="display: none;">';
                    html += contextMenu.getHtml(menu.subs, d + i);
                    html += "</div>"
                } else {
                    html += '<div class="ctxMenu-item" lay-id="' + menu.itemId + '">';
                    html += "<a>";
                    if (menu.icon) {
                        html += '<i class="' + menu.icon + ' ctx-icon"></i>'
                    }
                    html += menu.name;
                    html += "</a>"
                }
                html += "</div>";
                if (menu.hr == true) {
                    html += "<hr/>"
                }
            }
            return html;
        },
        getCommonCss: function () {
            var style = ".ctxMenu, .ctxMenu-sub {";
            style += "        max-width: 250px;";
            style += "        min-width: 110px;";
            style += "        background: white;";
            style += "        border-radius: 2px;";
            style += "        padding: 5px 0;";
            style += "        white-space: nowrap;";
            style += "        position: fixed;";
            style += "        z-index: 2147483647;";
            style += "        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);";
            style += "        border: 1px solid #d2d2d2;";
            style += "        overflow: visible;";
            style += "   }";
            style += "   .ctxMenu-item {";
            style += "        position: relative;";
            style += "   }";
            style += "   .ctxMenu-item > a {";
            style += "        font-size: 14px;";
            style += "        color: #666;";
            style += "        padding: 0 26px 0 35px;";
            style += "        cursor: pointer;";
            style += "        display: block;";
            style += "        line-height: 36px;";
            style += "        text-decoration: none;";
            style += "        position: relative;";
            style += "   }";
            style += "   .ctxMenu-item > a:hover {";
            style += "        background: #f2f2f2;";
            style += "        color: #666;";
            style += "   }";
            style += "   .ctxMenu-item > a > .icon-more {";
            style += "        position: absolute;";
            style += "        right: 5px;";
            style += "        top: 0;";
            style += "        font-size: 12px;";
            style += "        color: #666;";
            style += "   }";
            style += "   .ctxMenu-item > a > .ctx-icon {";
            style += "        position: absolute;";
            style += "        left: 12px;";
            style += "        top: 0;";
            style += "        font-size: 15px;";
            style += "        color: #666;";
            style += "   }";
            style += "   .ctxMenu hr {";
            style += "        background-color: #e6e6e6;";
            style += "        clear: both;";
            style += "        margin: 5px 0;";
            style += "        border: 0;";
            style += "        height: 1px;";
            style += "   }";
            style += "   .ctx-ic-lg {";
            style += "        font-size: 18px !important;";
            style += "        left: 11px !important;";
            style += "    }";
            return style
        },
        getPageHeight: function () {
            return document.documentElement.clientHeight || document.body.clientHeight
        },
        getPageWidth: function () { return document.documentElement.clientWidth || document.body.clientWidth },
    };

    $(document).off("click.ctxMenu").on("click.ctxMenu", function () {
        contextMenu.remove();
    });

    $(document).off("mousemove.ctxMenu").on("mousemove.ctxMenu", function (event) {
        var othis = contextMenu.getThis();
        if (othis.length > 0) {
            var left = parseInt(othis.css("left"));
            var top = parseInt(othis.css("top"));
            var width = othis.width();
            var height = othis.height();

            var section = 20;

            var clientX_1 = left - section;
            var clientX_2 = left + width + section;
            var clientY_1 = top - section;
            var clientY_2 = top + height + section;

            //判断鼠标是否在ctxMenu元素周围20px内
            if (clientX_1 < event.clientX && event.clientX < clientX_2 && clientY_1 < event.clientY && event.clientY < clientY_2) {

            } else {
                contextMenu.remove();
            }
        }
    });

    $(document).off("click.ctxMenuMore").on("click.ctxMenuMore", ".ctxMenu-item", function (d) {
        if ($(this).hasClass("haveMore")) {
            if (d !== void 0) {
                d.preventDefault();
                d.stopPropagation()
            }
        } else {
            contextMenu.remove();
        }
    });

    $("head").append('<style id="ew-css-ctx">' + contextMenu.getCommonCss() + "</style>");

    exports("contextMenu", contextMenu)
});