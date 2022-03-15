"use script";

/**
 * Maintain服务相关
 * @author LYW
 */
(function () {

    /**
     * 获取登录用户
     * @param {websocket} websocketserver 服务WebSocket对象
     */
    function logusers(websocketserver) {
        var logusers = []
        for (let i = 0; i < websocketserver.connections.length; i++) {
            const connection = websocketserver.connections[i];
            logusers.push({
                user: connection.loguser,
                login_time: connection.logtime
            });
        }
        return logusers;
    }

    module.exports.logusers = logusers;
})();