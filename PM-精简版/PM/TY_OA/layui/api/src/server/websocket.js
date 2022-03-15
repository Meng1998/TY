"use script";

/**
 * WebSocket服务相关
 * @author LYW
 */
(function () {
    const colors = require("colors-console");
    const tools = require("../utils/tools");
    const websocket = require("nodejs-websocket");
    const config = require("config");

    /**
     * 初始化websocket
     */
    function init() {
        //WebSocket端口
        const port = config.get("websocket.port");

        //创建Websocket服务
        const server = websocket.createServer(function (conn) {
            conn.on("text", function (str) {
                /**
                 * 连接websocket之后需要进行消息订`阅
                 */
                try {
                    if (str.indexOf("subscribe") >= 0) {
                        //开始订阅消息
                        var user = JSON.parse(str.replace("subscribe:", ""));
                        conn.subscribe = true;
                        conn.loguser = user;//登录用户
                        conn.logtime = (new Date()).format("yyyy-MM-dd hh:mm:ss");//登录时间
                        conn.sendText(tools.placeholder("subscribe success, loguser:{0}.", [user.user_name]));
                    }
                } catch (e) {

                }
            });
            conn.on("close", function (code, reason) {
            });
            conn.on("error", function (err) {
            });
        });

        server.listen(port, function () {
            //添加广播消息
            server.notice = function (ident, body) {
                this.connections.forEach(function (conn) {
                    if (conn.subscribe) {
                        //事件消息推送
                        var msg = JSON.stringify({
                            ident: ident,
                            body: body
                        });
                        conn.sendText(msg);
                    } else {
                        conn.sendText("subscribe error");
                    }
                });
            }
            console.log("%s服务：%s", config.get("websocket.name"), colors("green", "启动成功"));
        });

        return server;
    }

    module.exports.init = init;
})();