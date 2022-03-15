"use strict";

/**
 * Restify服务相关
 * @author LYW
 */
(function () {
    const colors = require("colors-console");
    const restify = require("restify");
    const corsMiddleware = require("restify-cors-middleware");
    const config = require("config");

    /**
     * 初始化Restify服务
     */
    function init() {
        //创建服务
        const server = restify.createServer({
            name: config.get("restify.name")
        });

        // server.pre(function (req, res, next) {
        //     //设置第一个参数为版本信息
        //     var pieces = req.url.replace(/^\/+/, "").split("/");
        //     var version = pieces[0];

        //     req.url = req.url.replace(version + "/", "");
        //     req.headers["accept-database"] = version;
        //     //req.files[""]
        //     return next();
        // });

        //设置跨域
        const cors = corsMiddleware({
            preflightMaxAge: 5, //Optional
            origins: ["*"],
            allowHeaders: ["*"]
        });
        server.pre(cors.preflight);
        server.use(cors.actual);

        //设置接收参数
        server.use(restify.plugins.queryParser());
        server.use(restify.plugins.bodyParser());

        //设置超时时间
        server.timeout = 3000;

        //监听端口
        const port = config.get("restify.port");

        //监听服务
        server.listen(port, function () {
            console.log("%s服务：%s", config.get("restify.name"), colors("green", "启动成功"));
        });

        return server;
    }

    module.exports.init = init;
})();