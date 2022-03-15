"use script";

/**
 * 扩展treeTable方法
 */
layui.extend({
    treeTable: "plugin/treeTable"
}).define("treeTable", function (exports) {

    var setter = layui.setter;
    var $ = layui.$;

    layui.treeTable.load = function (options) {

        //树节点属性
        var tree = {
            iconIndex: 1,
        }
        if (options.tree && options.tree.getIcon) {
            tree.getIcon = options.tree.getIcon;
        }

        options.where = options.where ? options.where : {};
        $.extend(true, options.where, options.fixed);

        // 渲染表格
        var treeTableIns = layui.treeTable.render({
            elem: "#" + options.elem,
            url: layui.base.API_URL(options.url),
            method: (options.fixed) ? "post" : (options.method ? options.method : "get"),
            tree: tree,
            cols: [options.cols],
            height: options.height ? options.height : "full-100",
            where: options.where ? options.where : {},
            toolbar: options.toolbar ? options.toolbar : false,
            toolbarEvent: options.toolbarEvent ? options.toolbarEvent : {},
            defaultToolbar: options.defaultToolbar ? options.defaultToolbar : ["filter", "print", "exports"],
            done: function () {
                treeTableIns.expandAll();
                treeTableIns.selected = null;
            }
        });

        // 监听行单击事件
        layui.treeTable.on("row(" + options.elem + ")", function (obj) {
            obj.tr.addClass(setter.table.selected).siblings().removeClass(setter.table.selected);
            treeTableIns.selected = obj.data;
            if (options.rowClick) {
                options.rowClick(obj.data);
            }
        });

        //监听工具条事件
        layui.treeTable.on("toolbar(" + options.elem + ")", function (obj) {
            options.toolbarEvent[obj.event](treeTableIns.selected, obj.config);
        });

        //监听工具条
        layui.treeTable.on("tool(" + options.elem + ")", function (obj) {
            options.toolbarEvent[obj.event](obj.data);
        });

        return treeTableIns;
    }
    exports("treeTableEx", layui.treeTable);
});