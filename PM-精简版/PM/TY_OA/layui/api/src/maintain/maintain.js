"use script";

/**
 * Maintain服务相关
 * @author LYW
 */
(function () {
    const colors = require("colors-console");
    const websocket = require("nodejs-websocket");
    const config = require("config");
    var CronJob = require('cron').CronJob;

    const advanced = require("./advanced");
    const database = require("./database");
    const uptimey = require("./uptimey");
    const users = require("./users");

    /**
     * 初始化websocket
     */
    function init(websocketserver) {
        //WebSocket端口
        const port = config.get("maintain.port");

        //创建Websocket服务
        const server = websocket.createServer(function (conn) {
            conn.on("text", async function (str) {
                /**
                 * 连接websocket之后需要进行消息订`阅
                 */
                try {
                    if (str === "subscribe") {
                        //开始订阅消息
                        conn.subscribe = true;
                        conn.sendText("subscribe success");
                        //发送系统信息，网络信息
                        var data = JSON.stringify({
                            ident: "basic",
                            body: await advanced.basic()
                        });
                        conn.sendText(data);
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
            new CronJob('*/1 * * * * *', function () {
                server.connections.forEach(async function (conn) {
                    if (conn.subscribe) {
                        //事件消息推送
                        var msg = JSON.stringify({
                            ident: "real",
                            body: {
                                advanced: advanced.monitor(),
                                database: await database.dbinfo(),
                                uptimey: uptimey.uptime(),
                                users: users.logusers(websocketserver)
                            }
                        });
                        conn.sendText(msg);
                    } else {
                        conn.sendText("subscribe error");
                    }
                });
            }, null, true);


            console.log("%s服务：%s", config.get("maintain.name"), colors("green", "启动成功"));
        });

        return server;
    }

    module.exports.init = init;
})();