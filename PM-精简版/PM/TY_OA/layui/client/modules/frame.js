"use script";

/**
 * @description LayAdmin 框架主入口
 */
layui.extend({
    view: "middleware/view",
    contextMenuEx: "middleware/plugin/contextMenu"
}).define(["base", "element", "layer", "laytpl", "view", "contextMenuEx"], function (exports) {
    var element = layui.element;//常用元素操作：element
    var layer = layui.layer;//常用元素操作：layer
    var laytpl = layui.laytpl;
    var setter = layui.setter;//培训信息
    var view = layui.view;
    var $ = layui.$;//常用元素操作：jQuery

    var APP = "#LAY_app";//容器ID

    var APP_TABS_HEADER_LI = "#LAY_app_tabsheader>li";//Tab页标签
    var APP_TABS_HEADER = "#LAY_app_tabsheader";//Tab页头
    var APP_BODY = "#LAY_app_body"; //Tab容器Id

    var SIDE_MENU = "#LAY-system-side-menu";//Menu菜单

    var FILTER_TAB_TBAS = "layadmin-layout-tabs";//Tab标题
    var TABS_BODY = ".layadmin-tabsbody-item";//Tab主体
    var SIDE_NAV_ITEMD = "layui-nav-itemed";//左侧菜单选中样式
    var ELEM_IFRAME = ".layadmin-iframe";

    var SHOW = "layui-show";
    var THIS = "layui-this";

    var APP_FLEXIBLE = "#LAY_app_flexible";

    var APP_SPREAD_SM = "layadmin-side-spread-sm";
    var ICON_SHRINK = "layui-icon-shrink-right";
    var ICON_SPREAD = "layui-icon-spread-left";
    var SIDE_SHRINK = "layadmin-side-shrink";
    var PopupRightIndex = null;

    /**
     * Tab页控制
     */
    var tabControl = {
        /**
         * 获取选中的Tab页索引
         */
        sltTabPage: function () {
            var othis = $(APP_TABS_HEADER_LI + '.layui-this');
            var index = othis.index();
            return index;
        },
        /**
         * 打开Tab页
         * @param {string} url 路径
         * @param {string} text 标题
         * @param {string} icon 图标
         * @param {string} ident 标识
         */
        openTabsPage: function (url, text, icon, ident) {

            var tabs = $(APP_TABS_HEADER_LI);//Tab页头集合
            var path = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, "");

            var matchTo;//是否存在
            //遍历页签Tab页
            tabs.each(function () {
                var li = $(this);
                var layid = li.attr("lay-id");

                if (layid === url) {
                    matchTo = true;
                    //tabControl.tabsPageIndex = index
                    //跳出循环
                    return false;
                }
            });

            //定位当前tabs
            var setThisTab = function () {
                //切换Tab页头
                element.tabChange(FILTER_TAB_TBAS, url);
                //切换Tab主页面
                tabControl.tabsBodyChange(tabControl.sltTabPage(), {
                    url: url,
                    text: text
                });
            };

            //如果未在遍历Tab页中匹配到，则追加Tab页
            if (!matchTo) {

                //添加Tab页头
                element.tabAdd(FILTER_TAB_TBAS, {
                    title: "<i class='" + icon + "'><span style='padding-left:10px;'>" + text + "</span></i>",
                    id: url,
                    attr: path
                });

                //路径
                var uri = url + layui.base.URL_V();
                //添加页面主体
                $(APP_BODY).append([
                    "<div data-type='" + ident + "' class='layadmin-tabsbody-item'>",
                    "<iframe src='" + uri + "' frameborder='0' class='layadmin-iframe'></iframe>",
                    "</div>"
                ].join(''));
            }

            //设置选择Tab页
            setThisTab();
        },
        /**
         * 根据索引切换Tab页主体
         * @param {number} index 索引
         */
        tabsBodyChange: function (index) {
            tabControl.tabsBody(index).addClass(SHOW).siblings().removeClass(SHOW);

            //Tab页头滚动
            tabControl.rollPage("auto", index);
        },
        /**
         * 根据索引获取Tab主体
         * @param {number} index 索引
         * @returns Tab主体
         */
        tabsBody: function (index) {
            //获取页面标签主体元素
            return $(APP_BODY).find(TABS_BODY).eq(index || 0);
        },
        /**
         * 页面标签滚动
         * @param {string} type 操作类型
         * @param {number} index 选项卡索引
         */
        rollPage: function (type, index) {
            //左右滚动页面标签
            var tabsHeader = $(APP_TABS_HEADER);
            var liItem = tabsHeader.children("li");
            var outerWidth = tabsHeader.outerWidth();
            var tabsLeft = parseFloat(tabsHeader.css("left"));

            //右左往右
            if (type === "left") {
                if (!tabsLeft && tabsLeft <= 0)
                    return;

                //当前的left减去可视宽度，用于与上一轮的页标比较
                var prefLeft = -tabsLeft - outerWidth;

                liItem.each(function (index, item) {
                    var li = $(item);
                    var left = li.position().left;

                    if (left >= prefLeft) {
                        tabsHeader.css("left", -left);
                        return false;
                    }
                });
            } else if (type === "auto") { //自动滚动
                (function () {
                    var thisLi = liItem.eq(index), thisLeft;

                    if (!thisLi[0]) return;
                    thisLeft = thisLi.position().left;

                    //当目标标签在可视区域左侧时
                    if (thisLeft < -tabsLeft) {
                        return tabsHeader.css("left", -thisLeft);
                    }

                    //当目标标签在可视区域右侧时
                    if (thisLeft + thisLi.outerWidth() >= outerWidth - tabsLeft) {
                        var subLeft = thisLeft + thisLi.outerWidth() - (outerWidth - tabsLeft);
                        liItem.each(function (i, item) {
                            var li = $(item);
                            var left = li.position().left;

                            //从当前可视区域的最左第二个节点遍历，如果减去最左节点的差 > 目标在右侧不可见的宽度，则将该节点放置可视区域最左
                            if (left + tabsLeft > 0) {
                                if (left - tabsLeft > subLeft) {
                                    tabsHeader.css("left", -left);
                                    return false;
                                }
                            }
                        });
                    }
                }());
            } else {
                //默认向左滚动
                liItem.each(function (i, item) {
                    var li = $(item);
                    var left = li.position().left;

                    if (left + li.outerWidth() >= outerWidth - tabsLeft) {
                        tabsHeader.css("left", -left);
                        return false;
                    }
                });
            }
        },
        /**
         * 关闭Tab页
         * @param {string} type 操作类型
         */
        closeTabsPage: function (type) {
            //当前选中页
            var sltTabPage = tabControl.sltTabPage();
            switch (type) {
                case "this":
                    //当前标签页
                    $(APP_TABS_HEADER_LI).eq(sltTabPage).find(".layui-tab-close").trigger("click");
                    break;
                case "other":
                    //其他标签页
                    var TABS_REMOVE = "LAY-system-pagetabs-remove";

                    $(APP_TABS_HEADER_LI).each(function (index, item) {
                        if (index && index != sltTabPage) {
                            $(item).addClass(TABS_REMOVE);
                            tabControl.tabsBody(index).addClass(TABS_REMOVE);
                        }
                    });
                    $('.' + TABS_REMOVE).remove();
                    break;
                case "all":
                    //全部标签页
                    $(APP_TABS_HEADER_LI + ":gt(0)").remove();
                    $(APP_BODY).find(TABS_BODY + ":gt(0)").remove();

                    $(APP_TABS_HEADER_LI).eq(0).trigger("click");
                    break;
            }
        }
    }

    /**
     * 左侧菜单控制
     */
    var menu = {
        /**
         * 匹配菜单
         * @param {string} url 菜单Id
         */
        match: function (url) {
            var sideMenu = $(SIDE_MENU);
            //重置状态
            sideMenu.find("." + THIS).removeClass(THIS);

            var pathURL = url;
            var getData = function (item) {
                return {
                    list: item.children(".layui-nav-child"),
                    a: item.children("*[lay-href]")
                }
            }

            sideMenu.children("li").each(function (index, item) {
                var primary = $(item);
                var primaryData = getData(primary);
                var primaryChildren = primaryData.list.children("dd");
                var matched = false;
                primaryChildren.each(function (index, item) {
                    var secondary = $(item);
                    var secondaryData = getData(secondary);
                    if (pathURL === secondaryData.a.attr("lay-href")) {
                        matched = true;
                        secondary.addClass(THIS).siblings().removeClass(THIS); //标记选择器
                        return false
                    }
                });
                if (matched) {
                    primary.addClass(SIDE_NAV_ITEMD).siblings().removeClass(SIDE_NAV_ITEMD); //标记选择器
                    return false;
                }
            });
        }
    }

    /**
     * 基础方法
     */
    var common = {
        /**
         * 获取屏幕类型
         */
        screen: function () {
            //屏幕类型
            var width = $(window).width()
            if (width > 1200) {
                return 3; //大屏幕
            } else if (width > 992) {
                return 2; //中屏幕
            } else if (width > 768) {
                return 1; //小屏幕
            } else {
                return 0; //超小屏幕
            }
        },
        /**
         * 侧边栏伸缩
         * @param {string} status 展开状态
         */
        sideFlexible: function (status) {
            var app = $(APP);
            var iconElem = $(APP_FLEXIBLE);
            var screen = common.screen();

            //设置状态，PC：默认展开、移动：默认收缩
            if (status === "spread") {
                //切换到展开状态的 icon，箭头：←
                iconElem.removeClass(ICON_SPREAD).addClass(ICON_SHRINK);
                //移动：从左到右位移；PC：清除多余选择器恢复默认
                if (screen < 2) {
                    app.addClass(APP_SPREAD_SM);
                } else {
                    app.removeClass(APP_SPREAD_SM);
                }
                app.removeClass(SIDE_SHRINK)
            } else {
                //切换到搜索状态的 icon，箭头：→
                iconElem.removeClass(ICON_SHRINK).addClass(ICON_SPREAD);
                //移动：清除多余选择器恢复默认；PC：从右往左收缩
                if (screen < 2) {
                    app.removeClass(SIDE_SHRINK);
                } else {
                    app.addClass(SIDE_SHRINK);
                }
                app.removeClass(APP_SPREAD_SM)
            }
        },
        /**
         * 全屏
         */
        fullScreen: function () {
            var ele = document.documentElement;
            var reqFullScreen = ele.requestFullScreen || ele.webkitRequestFullScreen || ele.mozRequestFullScreen || ele.msRequestFullscreen;
            if (typeof reqFullScreen !== "undefined" && reqFullScreen) {
                reqFullScreen.call(ele);
            };
        },
        /**
         * 退出全屏
         */
        exitScreen: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },
        /**
         * 右侧面板
         * @param {object} options 传入参数
         */
        popupRight: function (options) {
            if (PopupRightIndex) {
                layer.close(PopupRightIndex);
            }
            return PopupRightIndex = layer.open($.extend({
                id: 'LAY_adminPopupR',
                type: 1,
                anim: -1,
                title: false,
                closeBtn: false,
                offset: 'r',
                shadeClose: true,
                skin: 'layui-anim layui-anim-rl layui-layer-adminRight-detail',
                area: '300px'
            }, options));
        }
    }

    /**
     * 皮肤操作
     */
    var theme = {
        init: function (index) {
            //初始化主题
            var theme = setter.theme;
            index = index || 0;
            if (theme.color[index]) {
                theme.color[index].index = index;
                this.set({
                    color: theme.color[index]
                });
            }
        },
        set: function (options) {
            //主题设置
            var local = layui.data("local");
            var id = 'LAY_layadmin_theme';
            var style = document.createElement('style');
            var styleText = laytpl([
                //主题色
                '.layui-side-menu,',
                '.layadmin-pagetabs .layui-tab-title li:after,',
                '.layadmin-pagetabs .layui-tab-title li.layui-this:after,',
                '.layui-layer-admin .layui-layer-title,',
                '.layadmin-side-shrink .layui-side-menu .layui-nav>.layui-nav-item>.layui-nav-child',
                '{background-color:{{d.color.main}} !important; top:38px}',

                //选中色
                '.layui-nav-tree .layui-this,',
                '.layui-nav-tree .layui-this>a,',
                '.layui-nav-tree .layui-nav-child dd.layui-this,',
                '.layui-nav-tree .layui-nav-child dd.layui-this a',
                '{background-color:{{d.color.selected}} !important;}',

                //logo
                '.layui-layout-admin .layui-logo{background-color:{{d.color.logo || d.color.main}} !important;}',

                //头部色
                '{{# if(d.color.header){ }}',
                '.layui-layout-admin .layui-header{background-color:{{ d.color.header }};}',
                '.layui-layout-admin .layui-header a,',
                '.layui-layout-admin .layui-header a cite{color: #f8f8f8;}',
                '.layui-layout-admin .layui-header a:hover{color: #fff;}',
                '.layui-layout-admin .layui-header .layui-nav .layui-nav-more{border-top-color: #fbfbfb;}',
                '.layui-layout-admin .layui-header .layui-nav .layui-nav-mored{border-color: transparent; border-bottom-color: #fbfbfb;}',
                '.layui-layout-admin .layui-header .layui-nav .layui-this:after, .layui-layout-admin .layui-header .layui-nav-bar{background-color: #fff; background-color: rgba(255,255,255,.5);}',
                '.layadmin-pagetabs .layui-tab-title li:after{display: none;}',
                '{{# } }}'
            ].join('')).render(options = $.extend({}, local.theme, options));

            var styleElem = document.getElementById(id);

            //添加主题样式
            if ('styleSheet' in style) {
                style.setAttribute('type', 'text/css');
                style.styleSheet.cssText = styleText;
            } else {
                style.innerHTML = styleText;
            }
            style.id = id;

            styleElem && $("body")[0].removeChild(styleElem);
            $("body")[0].appendChild(style);
            $("body").attr('layadmin-themealias', options.color.alias);

            //本地存储记录
            local.theme = local.theme || {};
            layui.each(options, function (key, value) {
                local.theme[key] = value;
            });
            layui.data("local", {
                key: "theme",
                value: local.theme
            });
        }
    }

    /**
     * 按钮事件
     */
    var events = {
        /**
         * 伸缩
         */
        flexible: function (othis) {
            var iconElem = othis.find(APP_FLEXIBLE);
            var isSpread = iconElem.hasClass(ICON_SPREAD);
            common.sideFlexible(isSpread ? "spread" : null);
        },
        /**
         * 刷新
         */
        refresh: function () {
            var iframe = tabControl.tabsBody(tabControl.sltTabPage()).find(ELEM_IFRAME);
            iframe[0].contentWindow.location.reload(true);
        },
        /**
         * 全屏操作
         */
        fullscreen: function (othis) {
            //全屏
            var SCREEN_FULL = "layui-icon-screen-full";
            var SCREEN_REST = "layui-icon-screen-restore";
            var iconElem = othis.children("i");

            if (iconElem.hasClass(SCREEN_FULL)) {
                common.fullScreen();
                iconElem.addClass(SCREEN_REST).removeClass(SCREEN_FULL);
            } else {
                common.exitScreen();
                iconElem.addClass(SCREEN_FULL).removeClass(SCREEN_REST);
            }
        },
        /**
         * 左侧滚动
         */
        leftPage: function () {
            //向右滚动页面标签
            tabControl.rollPage("left");
        },
        /**
         * 右侧滚动
         */
        rightPage: function () {
            tabControl.rollPage();
        },
        closeThisTabs: function () {
            //关闭当前标签页
            tabControl.closeTabsPage("this");
        },
        closeOtherTabs: function () {
            //关闭其他
            tabControl.closeTabsPage("other");
            tabControl.rollPage("left");
        },
        closeAllTabs: function () {
            //关闭全部标签页
            tabControl.closeTabsPage("all");
        },
        theme: function () {
            //弹出主题面板
            common.popupRight({
                id: "LAY_PopupTheme",
                success: function () {
                    view(this.id).render("template/theme");
                }
            });
        },
        about: function () {
            //弹出主题面板
            common.popupRight({
                id: "LAY_PopupAbout",
                success: function () {
                    view(this.id).render("template/about");
                }
            });
        },
        setTheme: function (othis) {
            var index = othis.data('index')

            if (othis.hasClass(THIS)) return;

            othis.addClass(THIS).siblings('.layui-this').removeClass(THIS);
            theme.init(index);
        }
    }

    /**
     * WebSocket服务
     */
    var socket = {
        websocket: null,
        init: function (url, options) {
            //创建socket客户端
            socket.websocket = new ReconnectingWebSocket(url);

            socket.websocket.onopen = function () {
                console.log("connect success!");
                //订阅消息
                socket.websocket.send("subscribe:" + JSON.stringify(options));
                if (socket.websocket.reconnect) {
                    socket.websocket.reconnect = false;
                    layer.msg("服务器连接已恢复！", { icon: 1 });
                }
            }

            socket.websocket.onmessage = function (messageEvent) {
                var data = messageEvent.data;
                var origin = messageEvent.origin;
                if (data.indexOf("subscribe success") >= 0) {
                    console.log(data);
                } else {
                    if (socket.onmessage) {
                        socket.onmessage(data);
                    }
                }
            }

            socket.websocket.onerror = function () {
                layer.msg("服务器已断开，正在尝试重新连接，请稍等！", { icon: 8 });
                socket.websocket.reconnect = true;
            }
        },
        close: function () {
            socket.websocket.close();
        }
    }

    /**
     * 元素事件绑定监听
     */
    function eventsBind() {

        var $body = $("body");

        //Tab页标题点击切换
        $body.on("click", APP_TABS_HEADER_LI, function () {
            var othis = $(this);
            var index = othis.index();//获取当前位置
            tabControl.tabsBodyChange(index);
            //左侧菜单定位
            var id = othis.attr("lay-id");
            menu.match(id);
        });

        $body.on("contextmenu", APP_TABS_HEADER_LI, function (event) {
            $(this).trigger("click");
            var id = $(this).attr("lay-attr");
            if (id === "home.html") {
                return false;
            }
            layui.contextMenu.show(
                [
                    { icon: "layui-icon layui-icon-refresh", name: "刷新", hr: true, click: function () { events.refresh(); } },
                    { icon: "layui-icon layui-icon-close-fill ctx-ic-lg", name: "关闭", click: function () { events.closeThisTabs(); } },
                    { icon: "layui-icon layui-icon-unlink", name: "关闭其他", click: function () { events.closeOtherTabs(); } },
                    { icon: "layui-icon layui-icon-close ctx-ic-lg", name: "关闭全部", click: function () { events.closeAllTabs(); } }
                ],
                event.clientX,
                event.clientY
            );
            return false;
        });

        //监听Tab页删除
        element.on("tabDelete(" + FILTER_TAB_TBAS + ")", function (obj) {
            //移除Tab页主体
            obj.index && tabControl.tabsBody(obj.index).remove();

            //获取当前选中页面
            var othis = $(APP_TABS_HEADER_LI + ".layui-this");
            var index = othis.index();
            tabControl.tabsBodyChange(index);
            //左侧菜单定位
            var id = othis.attr("lay-id");
            menu.match(id);
        });

        //绑定左侧菜单事件
        $body.on("click", "*[lay-href]", function () {
            var othis = $(this);
            var href = othis.attr("lay-href");
            var icon = othis.attr("lay-icon");
            var text = othis.attr("lay-text");
            var ident = othis.attr("lay-ident");

            tabControl.openTabsPage(href, text || othis.text(), icon, ident);
        });

        //左侧菜单收缩时Tip标签
        $body.on("mouseenter", "*[lay-tips]", function () {
            var othis = $(this);

            if (othis.parent().hasClass("layui-nav-item") && !$(APP).hasClass(SIDE_SHRINK)) {
                return;
            }

            var tips = othis.attr("lay-tips");
            var offset = othis.attr("lay-offset");
            var direction = othis.attr("lay-direction");
            var index = layer.tips(tips, this, {
                tips: direction || 1,
                time: -1,
                success: function (layero) {
                    if (offset) {
                        layero.css("margin-left", offset + "px");
                    }
                }
            });
            othis.data("index", index);
        }).on("mouseleave", "*[lay-tips]", function () {
            layer.close($(this).data("index"));
        });

        //绑定按钮事件
        $body.on("click", "*[layadmin-event]", function () {
            var othis = $(this);
            var attrEvent = othis.attr("layadmin-event");
            events[attrEvent] && events[attrEvent].call(this, othis);
        });

        //监听侧边导航点击事件
        element.on("nav(layadmin-system-side-menu)", function (elem) {
            if (elem.siblings(".layui-nav-child")[0] && $(APP).hasClass(SIDE_SHRINK)) {
                common.sideFlexible("spread");
                layer.close(elem.data("index"));
            };
        });

        //监听选项卡的更多操作
        element.on("nav(layadmin-pagetabs-nav)", function (elem) {
            var dd = elem.parent();
            dd.removeClass(THIS);
            dd.parent().removeClass(SHOW);
        });
    }

    !function () {
        //初始化
        if (common.screen() < 2) {
            common.sideFlexible();
        }
        eventsBind();
        //主题初始化，本地主题记录优先，其次为 initColorIndex
        var local = layui.data("local");
        if (local.theme) {
            theme.set(local.theme);
        } else if (setter.theme) {
            //默认皮肤
            theme.init(setter.theme.initColorIndex);
        }
    }();

    //对外输出
    exports("frame", {
        tabControl: tabControl,
        menu: menu,
        common: common,
        theme: theme,
        socket: socket,
        events: events
    });
});