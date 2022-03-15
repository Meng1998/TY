"use strict";

/**
 * token验证
 */
(function () {

    const response = require("../../middleware/response");
    const request = require("request");

    /**
     * 获取行政区划数据
     */
    const getGeoAtlas = {
        method: "post",
        routor: "/getGeoAtlas",
        describe: "获取行政区划数据",
        callback: async function (req, res) {
            var datav = async function (code) {
                return new Promise(function (resolve, reject) {
                    request("https://geo.datav.aliyun.com/areas_v2/bound/" + code + "_full.json", function (err, response, body) {
                        if (!err && response.statusCode == 200) {
                            resolve(body);
                        } else {
                            reject(err);
                        }
                    });
                });
            }

            var geoJson = await datav(req.body.code);
            res.send(response.jsonData({
                success: true,
                data: JSON.parse(geoJson)
            }));
        }
    }

    module.exports.getGeoAtlas = getGeoAtlas;
    module.exports.description = "阿里云数据";
})();