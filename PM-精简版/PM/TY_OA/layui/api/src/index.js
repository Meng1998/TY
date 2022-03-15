"use strict";

/**
 * MapVision_V5 WebAPI
 * 程序主入口
 */
(function () {

    //初始化Restify服务
    const restify = require("./server/restify").init();

    //初始化WebSocket服务
    const websocket = require("./server/websocket").init();

    //创建WebAPI
    try {
        require("./core/core").init();
        require("./maintain/maintain").init(websocket);
        require("./webapi/main")(restify, websocket);
    } catch (e) {
        console.log(e);
    }
})();