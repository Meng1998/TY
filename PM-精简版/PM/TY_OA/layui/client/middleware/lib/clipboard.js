"use script";

/**
 * 扩展Echarts方法
 */
layui.extend({
    clipboard: "lib/clipboard/clipboard"
}).define("ClipboardJS", function (exports) {

    layui.ClipboardJS.initialize = function (dom) {
        var clipboard = new layui.ClipboardJS(dom);
        clipboard.on('success', function (e) {
            layer.msg("机器码已复制！", { icon: 1 });
            clipboard.destroy();  //解决多次弹窗
            e.clearSelection();
        });
    }
    exports("clipboardEx", layui.ClipboardJS);
});