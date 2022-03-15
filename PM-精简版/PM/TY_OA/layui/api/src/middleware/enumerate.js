"use strict";

/**
 * 枚举类
 */
(function () {

    /**
     * 操作类型
     */
    const Operation = {
        /**
         * 读取
         */
        Read: "0",
        /**
         * 添加
         */
        Create: "1",
        /**
         * 修改
         */
        Update: "2",
        /**
         * 删除
         */
        Delete: "3"
    }

    /**
     * 上图方式
     */
    const MapType = {
        /**
         * 模型
         */
        model: "model",
        /**
         * 点
         */
        point: "point",
        /**
         * 线
         */
        polyline: "polyline",
        /**
         * 面
         */
        polygon: "polygon",
        /**
         * 墙
         */
        wall: "wall"
    }

    module.exports.Operation = Operation;
    module.exports.MapType = MapType;
})()