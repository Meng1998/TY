"use script";

/**
 * 扩展时间线方法
 */
layui.define(function (exports) {
    var $ = layui.jquery;
    var MOD_NAME = "timeline";  // 模块名

    var obj = {
        render: function (options) {

            var dateKey = options.dateKey ? options.dateKey : "date";
            var titleKey = options.titleKey ? options.titleKey : "title";
            var contentKey = options.contentKey ? options.contentKey : "content";
            if (options.parseData) {
                options.data = options.parseData(options.data);
            }

            $(options.elem).empty();
            for (let i = 0; i < options.data.length; i++) {
                const item = options.data[i];

                var html = "";
                html += '<li class="layui-timeline-item">';
                html += '<i class="layui-icon layui-timeline-axis"></i>';
                html += '<div class="layui-timeline-content layui-text">';
                html += '<h3 class="layui-timeline-title">' + (options.dateFormat ? options.dateFormat(item[dateKey]) : item[dateKey]) + '</h3>';
                if (item[titleKey]) {
                    html += '<label style="font-size: 16px;">' + item[titleKey] + '</label>';
                }
                html += '<hr/>';
                html += '<pre style="font-size: 14px;">';
                html += item[contentKey];
                html += '</pre>';
                html += '</div>';
                html += '</li>';

                $(options.elem).append(html);
            }
        }
    }

    exports(MOD_NAME, obj);
});