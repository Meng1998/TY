"use script";

/**
 * 扩展treeSelect方法
 */
layui.extend({
    contextMenu: "plugin/contextMenu"
}).define("contextMenu", function (exports) { 
    exports("contextMenuEx", layui.contextMenu);
});