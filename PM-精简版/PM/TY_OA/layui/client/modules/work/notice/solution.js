"use script";

/**
 * @description 主页面业务操作
 */
layui.extend({
    base: "middleware/base"
}).define(["base", "element", "form"], async function (exports) {

    var request = layui.request;
    var $ = layui.$;

    request.when({
        deferreds: [
            { name: "user_solution", url: "/prj/feedback_solution/list", data: { feedback_id: $("#id").val() } },
            { name: "feedback_solution", url: "/prj/feedback", data: { id: $("#id").val() } }
        ],
        success: function (result) {
            $(".layui-tab-title").append("<li class='layui-this'>技术方案</li>");
            $(".layui-tab-content").append(templet(result.feedback_solution.solution, true));
            for (let i = 0; i < result.user_solution.list.length; i++) {
                const user = result.user_solution.list[i];
                $(".layui-tab-title").append("<li>" + user.user_name + "</li>");
                $(".layui-tab-content").append(templet(user.solution));
            }
        }
    });

    function templet(text, show) {
        var html = "";
        html += ((show) ? "<div class='layui-tab-item layui-show'>" : "<div class='layui-tab-item'>");
        html += "<textarea rows='11' readonly class='layui-textarea'>" + (text ? text : "") + "</textarea>";
        html += "</div>";
        return html;
    }

    //对外输出
    exports("main", {});
});