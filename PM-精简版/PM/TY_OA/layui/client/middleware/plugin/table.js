"use script";

/**
 * 扩展table方法
 */
layui.define("table", function (exports) {

    var setter = layui.setter;
    var $ = layui.$;

    /**
     * 重写加载表格
     * @param {object} options 加载参数
     */
    layui.table.load = function (options) {
        options.where = options.where ? options.where : {};
        $.extend(true, options.where, options.fixed);
        var instance = null;
        var tableIns = layui.table.render({
            elem: "#" + options.elem,
            url: options.url ? layui.base.API_URL(options.url) : null,
            data: options.data ? options.data : null,
            method: options.method ? options.method : "post",
            cols: options.theads ? options.theads : [options.cols],
            page: (options.page ? options.page : true) && (options.page !== false),
            limit: (options.page === false) ? Number.MAX_VALUE : setter.table.limit,
            limits: setter.table.limits,
            height: options.height ? options.height : "full-100",
            where: options.where ? options.where : {},
            toolbar: options.toolbar ? options.toolbar : false,
            toolbarEvent: options.toolbarEvent ? options.toolbarEvent : {},
            defaultToolbar: options.defaultToolbar ? options.defaultToolbar : ["filter", "print", "exports"],
            totalRow: options.totalRow,
            parseData: function (result) {
                var data;
                layui.base.resHandle({
                    result: result,
                    success: function (result) {
                        data = {
                            code: 0, //解析接口状态
                            msg: "", //解析提示文本
                            count: result.count, //解析数据长度
                            data: result.list //解析数据列表
                        };
                        if (options.parseData) {
                            data = options.parseData(data);
                        }
                    },
                    error: function (result) {
                    }
                });
                return data;
            },
            headers: {
                Authorization: "application/json",
                token: layui.base.getToken(),
                user: (layui.sessionData("session").user) ? layui.sessionData("session").user.user_name : ""
            },
            done: function (res, curr, count) {
                if (tableIns) {
                    if (options.cache === false) {
                        //清除初始条件
                        this.where = {}
                    }

                    //加载完成后清空选中行
                    tableIns.selected = null;
                    tableIns.instance = this;
                } else {
                    instance = this;
                }
                if (options.done) {
                    options.done(this, {
                        res: res,
                        curr: curr,
                        count: count
                    });
                }
            }
        });

        //设置固定字段属性
        tableIns.field = options.field;
        if (!tableIns.instance && instance) {
            tableIns.instance = instance;
        }

        if (options.row !== false) {
            //监听行点击事件
            layui.table.on("row(" + options.elem + ")", function (obj) {
                if (options.clickClass) {
                    obj.tr.addClass(setter.table.selected + " " + options.clickClass).siblings().removeClass(setter.table.selected + " " + options.clickClass);
                } else {
                    obj.tr.addClass(setter.table.selected).siblings().removeClass(setter.table.selected);
                }
                tableIns.selected = obj.data;
                tableIns.selectedIndex = obj.tr.attr("data-index");
                if (options.rowClick) {
                    //行数据，下标
                    options.rowClick(obj.data, obj.tr.attr("data-index"));
                }
            });
        }

        //监听工具条事件
        layui.table.on("toolbar(" + options.elem + ")", function (obj) {
            options.toolbarEvent[obj.event](tableIns.selected, tableIns.selectedIndex, obj.config);
        });

        //监听工具条
        layui.table.on("tool(" + options.elem + ")", function (obj) {
            options.toolbarEvent[obj.event](obj.data, obj);
        });

        if (options.edit) {
            //监听单元格编辑
            layui.table.on("edit(" + options.elem + ")", function (obj) {
                options.edit(obj);
            });
        }

        /**
         * 条件查询
         * @param {object} data 查询条件
         */
        tableIns.search = function (data) {
            this.reload({
                where: this.fieldHandle(data),
                page: {
                    curr: 1
                }
            });
        }

        /**
         * 重置
         * @param {object} data 查询条件
         */
        tableIns.reset = function (data) {
            //清空查询条件
            var field = data.hasOwnProperty("field") ? data.field : data;
            for (var p in field) {
                field[p] = "";
            }
            //搜索
            this.search(field);
        }

        /**
         * 条件处理
         * @param {object} data 查询条件
         */
        tableIns.fieldHandle = function (data) {
            var field = data.hasOwnProperty("field") ? data.field : data;
            var fixed = this.fixed;
            if (fixed) {
                for (var p in fixed) {
                    field[p] = fixed[p];
                }
            }
            return field;
        }

        return tableIns;
    }

    exports("tableEx", layui.table);
});