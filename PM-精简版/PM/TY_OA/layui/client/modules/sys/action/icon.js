"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base",
    icon: "middleware/icon"
}).define(["base", "icon", "element"], function (exports) {

    var iconList = layui.icon;
    var $ = layui.$;


    initIcons('layui-icon', 'layuiIcon', 0); //layui内置图标
    //font awesome 图标
    initIcons('fa-icon-web', 'webIcon', 1);//网页
    initIcons('fa-icon-form', 'formIcon', 1); //表单
    initIcons('fa-icon-chart', 'chartIcon', 1);//图表
    initIcons('fa-icon-money', 'moneyIcon', 1);//货币
    initIcons('fa-icon-text', 'textIcon', 1);//文本编辑
    initIcons('fa-icon-file', 'fileIcon', 1);//文件类型
    initIcons('fa-icon-direction', 'directionIcon', 1);//指示方向
    initIcons('fa-icon-play', 'playIcon', 1);//视频播放
    initIcons('fa-icon-aux', 'auxIcon', 1);//辅助功能
    initIcons('fa-icon-new', 'newIcon', 1);//版本新增

    $('.hn-icon li').on('dblclick', function () {
        var cls = $(this).find('i').attr('class')
        //$('#@ViewBag.ObjID').val(cls);
        formWin.setIcon(cls);
        window.parentLayer.close(window.index);
    })

    function initIcons(id, name, type) {
        var list = type == 0 ? iconList[name] : iconList['fontAwesome'][name];
        for (var i = 0; i < list.length; i++) {
            $('#' + id).append("<li><i class='" + list[i].icon + (list[i].icon.indexOf('layui-icon-loading') >= 0 ? " layui-anim layui-anim-rotate layui-anim-loop" : "") + "'></i></li>")
        }
    }

    //对外输出
    exports("main", {});
});