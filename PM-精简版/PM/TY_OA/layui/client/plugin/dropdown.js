/** 下拉菜单模块 date:2020-05-04   License By http://easyweb.vip */
layui.define(["jquery"], function (f) {
    var h = layui.jquery;
    var i = "dropdown-open";
    var e = "dropdown-disabled";
    var b = "dropdown-no-scroll";
    var c = "dropdown-menu-shade";
    var n = "dropdown-menu";
    var m = "dropdown-menu-nav";
    var j = "dropdown-hover";
    var d = "fixed";
    var g = "no-shade";
    var k = "layui-anim layui-anim-upbit";
    var a = "layui-anim layui-anim-fadein";
    var l = ["bottom-left", "bottom-right", "bottom-center", "top-left", "top-right", "top-center", "left-top", "left-bottom", "left-center", "right-top", "right-bottom", "right-center"];
    if (h("#ew-css-dropdown").length <= 0) {
        var $head = h('head');
        $head.append("<style>.dropdown-no-scroll{overflow:hidden}.dropdown-fix-parent{z-index:auto!important}.dropdown-menu-shade{position:fixed;left:0;right:0;top:0;bottom:0;z-index:9998;background-color:rgba(0,0,0,.1)}.dropdown-menu-shade.no-shade{background-color:transparent}.dropdown-menu-nav.dark,.dropdown-menu-nav.dark .dropdown-menu-nav-child{background:#32363f;border-color:#484e58}.dropdown-menu-nav.dark>li>a,.dropdown-menu-nav.dark .dropdown-menu-nav-child>li>a{color:#a1a8b8}.dropdown-menu-nav.dark>li>a:hover,.dropdown-menu-nav.dark .dropdown-menu-nav-child>li>a:hover{background-color:#272b34}.dropdown-menu-nav.dark>li.disabled>a,.dropdown-menu-nav>li.disabled>a:hover,.dropdown-menu-nav.dark .dropdown-menu-nav-child>li.disabled>a,.dropdown-menu-nav .dropdown-menu-nav-child>li.disabled>a:hover{color:#7a8191}.dropdown-menu-nav.dark>hr,.dropdown-menu-nav.dark .dropdown-menu-nav-child>hr{background-color:#484e58}.dropdown-menu-nav.dark>li.title,.dropdown-menu-nav.dark .dropdown-menu-nav-child>li.title{color:#868b9a}.dropdown-menu-nav.dark .dropdown-anchor{border-color:#484e58}.dropdown-menu-nav.dark .dropdown-anchor::after{border-color:#32363f}.dropdown-menu{position:relative;display:inline-block;vertical-align:bottom}.dropdown-menu-nav,.dropdown-menu-nav .dropdown-menu-nav-child{position:absolute;padding:5px 0;margin:0;overflow:visible;min-width:110px;background:#fff;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.12);border:1px solid #e4e4e4;line-height:initial;text-align:left;z-index:9999}.dropdown-menu .dropdown-menu-nav{display:none}.dropdown-menu.dropdown-open .dropdown-menu-nav{display:block}.dropdown-menu-nav.fixed{position:fixed}.dropdown-menu-nav>li,.dropdown-menu-nav-child>li{padding:0;margin:0;line-height:18px;user-select:none;list-style:none;position:relative}.dropdown-menu-nav>li>a,.dropdown-menu-nav-child>li>a{display:block;color:#555;font-size:14px;padding:10px 15px;text-decoration:none;white-space:nowrap;cursor:pointer;user-select:none}.dropdown-menu-nav>li>a:hover,.dropdown-menu-nav-child>li>a:hover{background-color:#eee}.dropdown-menu-nav>li .layui-icon,.dropdown-menu-nav-child>li .layui-icon{font-size:14px;margin-right:5px}.dropdown-menu-nav>hr,.dropdown-menu-nav-child>hr{height:1px;margin:3px 0;background-color:#e6e6e6}.dropdown-menu-nav>li.disabled,.dropdown-menu-nav-child>li.disabled{cursor:not-allowed}.dropdown-menu-nav>li.disabled>a,.dropdown-menu-nav>li.disabled>a:hover,.dropdown-menu-nav-child>li.disabled>a,.dropdown-menu-nav-child>li.disabled>a:hover{color:#999;cursor:not-allowed;pointer-events:none;background-color:transparent}.dropdown-menu-nav>li.title,.dropdown-menu-nav-child>li.title{color:#999;font-size:12px;padding:3px 15px}.dropdown-menu-nav .dropdown-menu-nav-child{left:100%;top:0;display:none}.dropdown-menu-nav .show-left .dropdown-menu-nav-child{left:auto;right:100%}.dropdown-menu-nav>li.active>.dropdown-menu-nav-child,.dropdown-menu-nav-child>li.active>.dropdown-menu-nav-child{display:block}.dropdown-menu-nav>li.have-more:after,.dropdown-menu-nav-child>li.have-more:after{content:'\e602';font-family:layui-icon!important;font-size:14px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;position:absolute;right:4px;color:#666;top:50%;margin-top:-8px}.dropdown-menu-nav .dropdown-anchor,.dropdown-menu-nav .dropdown-anchor:after{border:8px solid #e4e4e4;position:absolute;display:inline-block}.dropdown-menu-nav .dropdown-anchor:after{content:'';border:7px solid #fff}.dropdown-menu-nav.dropdown-bottom-left{top:100%}.dropdown-menu-nav.dropdown-bottom-left{margin-top:8px}.dropdown-menu-nav.dropdown-bottom-left .dropdown-anchor,.dropdown-menu-nav.dropdown-bottom-left .dropdown-anchor:after{border-top-color:transparent;border-right-color:transparent;border-left-color:transparent;top:-16px}.dropdown-menu-nav.dropdown-bottom-left .dropdown-anchor:after{top:-6px;left:-7px}.dropdown-menu-nav.dropdown-bottom-left .dropdown-anchor{left:12px}.dropdown-menu-nav.dropdown-bottom-right{right:0}.dropdown-menu-nav.dropdown-bottom-right{margin-top:8px}.dropdown-menu-nav.dropdown-bottom-right .dropdown-anchor,.dropdown-menu-nav.dropdown-bottom-right .dropdown-anchor:after{border-top-color:transparent;border-right-color:transparent;border-left-color:transparent;top:-16px}.dropdown-menu-nav.dropdown-bottom-right .dropdown-anchor:after{top:-6px;left:-7px}.dropdown-menu-nav.dropdown-bottom-right .dropdown-anchor{right:12px}.dropdown-menu-nav.dropdown-bottom-center{left:50%}.dropdown-menu-nav.dropdown-bottom-center{margin-top:8px}.dropdown-menu-nav.dropdown-bottom-center .dropdown-anchor,.dropdown-menu-nav.dropdown-bottom-center .dropdown-anchor:after{border-top-color:transparent;border-right-color:transparent;border-left-color:transparent;top:-16px}.dropdown-menu-nav.dropdown-bottom-center .dropdown-anchor:after{top:-6px;left:-7px}.dropdown-menu-nav.dropdown-bottom-center .dropdown-anchor{left:calc(50% - 8px)}.dropdown-menu-nav.dropdown-top-left{bottom:100%} </style>");
    }
    var o = {
        init: function () {
            h(document).off("click.dropdown").on("click.dropdown", "." + n + ">*:first-child", function (t) {
                var u = h(this).parent(); if (!u.hasClass(j)) {
                    if (u.hasClass(i)) {
                        u.removeClass(i)
                    } else {
                        o.hideAll(); o.show(h(this).parent().find("." + m))
                    }
                } t.stopPropagation()
            }); h(document).off("click.dropHide").on("click.dropHide", function (t) {
                o.hideAll()
            }); h(document).off("click.dropNav").on("click.dropNav", "." + m, function (t) {
                t.stopPropagation()
            }); var s, p, q = "." + n + "." + j; h(document).off("mouseenter.dropdown").on("mouseenter.dropdown", q, function (t) {
                if (p && p == t.currentTarget) {
                    clearTimeout(s)
                } o.show(h(this).find("." + m))
            }); h(document).off("mouseleave.dropdown").on("mouseleave.dropdown", q, function (t) {
                p = t.currentTarget; s = setTimeout(function () { h(t.currentTarget).removeClass(i) }, 300)
            }); h(document).off("click.dropStand").on("click.dropStand", "[data-dropdown]", function (t) { o.showFixed(h(this)); t.stopPropagation() }); var r = "." + m + " li"; h(document).off("mouseenter.dropdownNav").on("mouseenter.dropdownNav", r, function (t) { h(this).children(".dropdown-menu-nav-child").addClass(k); h(this).addClass("active") }); h(document).off("mouseleave.dropdownNav").on("mouseleave.dropdownNav", r, function (t) { h(this).removeClass("active"); h(this).find("li.active").removeClass("active") }); h(document).off("click.popconfirm").on("click.popconfirm", ".dropdown-menu-nav [btn-cancel]", function (t) { o.hideAll(); t.stopPropagation() })
        },
        openClickNavClose: function () {
            h(document).off("click.dropNavA").on("click.dropNavA", "." + m + ">li>a", function (p) {
                o.hideAll(); h(this).parentsUntil("." + n).last().parent().removeClass(i); p.stopPropagation()
            })
        },
        hideAll: function () {
            h("." + n).removeClass(i); h("." + m + "." + d).addClass("layui-hide"); h("." + c).remove(); h("body").removeClass(b); h(".dropdown-fix-parent").removeClass("dropdown-fix-parent"); h("[data-dropdown]").removeClass(i)
        }, show: function (r) { if (r && r.length > 0 && !r.hasClass(e)) { if (r.hasClass("dropdown-popconfirm")) { r.removeClass(k); r.addClass(a) } else { r.removeClass(a); r.addClass(k) } var p; for (var q = 0; q < l.length; q++) { if (r.hasClass("dropdown-" + l[q])) { p = l[q]; break } } if (!p) { r.addClass("dropdown-" + l[0]); p = l[0] } o.forCenter(r, p); r.parent("." + n).addClass(i); return p } return false }, showFixed: function (q) {
            var t = h(q.data("dropdown")), p; if (!t.hasClass("layui-hide")) { o.hideAll(); return } o.hideAll(); p = o.show(t); if (p) {
                t.addClass(d); t.removeClass("layui-hide");
                var s = o.getTopLeft(q, t, p);
                s = o.checkPosition(t, q, p, s); t.css(s); h("body").addClass(b); var r = (q.attr("no-shade") == "true"); h("body").append('<div class="' + (r ? (c + " " + g) : c) + ' layui-anim layui-anim-fadein"></div>'); q.parentsUntil("body").each(function () { var u = h(this).css("z-index"); if (/[0-9]+/.test(u)) { h(this).addClass("dropdown-fix-parent") } }); q.addClass(i)
            }
        }, forCenter: function (p, u) {
            if (!p.hasClass(d)) {
                var t = p.parent().outerWidth(), q = p.parent().outerHeight();
                var s = p.outerWidth(), v = p.outerHeight();
                var w = u.split("-"), r = w[0], x = w[1];
                if ((r == "top" || r == "bottom") && x == "center") {
                    p.css("left", (t - s) / 2)
                }
                if ((r == "left" || r == "right") && x == "center") {
                    p.css("top", (q - v) / 2)
                }
            }
        }, getTopLeft: function (B, A, y) {
            var w = B.outerWidth();
            var u = B.outerHeight();
            var p = A.outerWidth();
            var x = A.outerHeight();
            var z = B.offset().top - h(document).scrollTop();
            var t = B.offset().left;
            var D = t + w;
            var C = 0, s = 0;
            var v = y.split("-");
            var r = v[0];
            var q = v[1];
            if (r == "top" || r == "bottom") {
                x += 8; switch (q) {
                    case "left": s = t; break; case "center": s = t - p / 2 + w / 2; break; case "right": s = D - p
                }
            }
            if (r == "left" || r == "right") {
                p += 8;
                switch (q) {
                    case "top": C = z + u - x;
                        break; case "center": C = z - x / 2 + u / 2;
                        break; case "bottom": C = z
                }
            }
            switch (r) {
                case "top": C = z - x;
                    break; case "right": s = t + w;
                    break; case "bottom": C = z + u; break; case "left": s = t - p
            }
            return {
                top: C, left: s, right: "auto", bottom: "auto"
            }
        }, checkPosition: function (t, q, p, r) {
            var s = p.split("-"); if ("bottom" == s[0]) {
                if ((r.top + t.outerHeight()) > o.getPageHeight()) {
                    r = o.getTopLeft(q, t, "top-" + s[1]);
                    t.removeClass("dropdown-" + p);
                    t.addClass("dropdown-top-" + s[1])
                }
            } else {
                if ("top" == s[0]) {
                    if (r.top < 0) {
                        r = o.getTopLeft(q, t, "bottom-" + s[1]);
                        t.removeClass("dropdown-" + p);
                        t.addClass("dropdown-bottom-" + s[1])
                    }
                }
            } return r
        },
        getPageHeight: function () {
            return document.documentElement.clientHeight || document.body.clientHeight
        },
        getPageWidth: function () {
            return document.documentElement.clientWidth || document.body.clientWidth
        }
    };
    o.init(); f("dropdown", o)
});