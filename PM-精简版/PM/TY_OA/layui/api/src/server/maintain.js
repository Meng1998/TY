"use script";

/**
 * Maintain服务相关
 * @author LYW
 */
(function () {
    const colors = require("colors-console");
    const websocket = require("nodejs-websocket");
    const config = require("config");
    var os = require("os");
    const osName = require("os-name");
    const winRelease = require('win-release');
    var CronJob = require('cron').CronJob;

    /**
     * 初始化websocket
     */
    function init(websocketserver) {
        //WebSocket端口
        const port = config.get("maintain.port");

        //创建Websocket服务
        const server = websocket.createServer(function (conn) {
            conn.on("text", function (str) {
                /**
                 * 连接websocket之后需要进行消息订`阅
                 */
                try {
                    if (str === "subscribe") {
                        //开始订阅消息
                        conn.subscribe = true;
                        conn.sendText("subscribe success");
                        //发送系统信息，网络信息
                        
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

            var currCPU = 0;

            new CronJob('*/1 * * * * *', function () {
                /**
                 * 获取CPU使用率
                 */
                getCPUUsage(function (value) {
                    currCPU = value;
                });

                server.connections.forEach(function (conn) {
                    if (conn.subscribe) {
                        //事件消息推送
                        var msg = JSON.stringify({
                            users: getLogUser(websocketserver),
                            os: osInfo(currCPU),
                            process: getProcess()
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

    /**
     * 获取服务器信息
     */
    function osInfo(currCPU) {
        var release = winRelease();//系统版本
        var tempDist = osName();
        var tempDist = tempDist.split(' ');
        var dist = tempDist[0];


        var freemem = os.freemem() / 1024 / 1024 / 1024;
        var totalmem = os.totalmem() / 1024 / 1024 / 1024;
        return {
            cpu_usage: (currCPU * 100.0).toFixed(2) + "%",//CPU使用率
            freemem: freemem.toFixed(2) + "G",//空闲内存
            totalmem: totalmem.toFixed(2) + "G",//内存大小
            usedMem: (totalmem - freemem).toFixed(2) + "G",//已用内存
            MemUsage: ((totalmem - freemem) / totalmem * 100.0).toFixed(2) + "%",//使用率
        }
    }

    /**
     * 获取CPU使用率
     * @param {function} callback 回调方法
     * @param {boolean} free 是否空闲
     */
    function getCPUUsage(callback, free) {

        var stats1 = getCPUInfo();
        var startIdle = stats1.idle;
        var startTotal = stats1.total;

        setTimeout(function () {
            var stats2 = getCPUInfo();
            var endIdle = stats2.idle;
            var endTotal = stats2.total;

            var idle = endIdle - startIdle;
            var total = endTotal - startTotal;
            var perc = idle / total;

            if (free === true)
                callback(perc);
            else
                callback((1 - perc));
        }, 1000);

        /**
         * 获取CPU信息
         */
        function getCPUInfo(callback) {
            var cpus = os.cpus();

            var user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;

            for (var cpu in cpus) {
                if (cpus[cpu].times) {
                    user += cpus[cpu].times.user;
                    nice += cpus[cpu].times.nice;
                    sys += cpus[cpu].times.sys;
                    irq += cpus[cpu].times.irq;
                    idle += cpus[cpu].times.idle;
                }
            }

            var total = user + nice + sys + idle + irq;

            return {
                "idle": idle,
                "total": total
            };
        }
    }

    /**
     * 获取登录用户
     * @param {object} websocketserver WebSocket服务
     */
    function getLogUser(websocketserver) {
        var logusers = []
        for (let i = 0; i < websocketserver.connections.length; i++) {
            const connection = websocketserver.connections[i];
            const user = connection.loguser;
            logusers.push({
                user: connection.loguser,
                login_time: connection.logtime
            });
        }
        return logusers;
    }

    /**
     * 获取进程信息
     */
    function getProcess() {
        return {
            version: process.version,//服务版本
            uptime: Math.floor(process.uptime())//运行时间
        }
    }

    module.exports.init = init;
})();