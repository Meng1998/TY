"use strict";

/**
 * token验证
 */
(function () {

    const response = require("../../middleware/response");
    const fs = require('fs');
    const path = require('path');
    const jwtutil = require("../../utils/jwt");
    const NodeRSA = require('node-rsa');
    const NodeRSA2 = require('node-rsa');
    const key = new NodeRSA({ b: 512 });
    const key2 = new NodeRSA2({ b: 512 });
    const tokenArr = [];

    const rsa = []

    /**
     * 获取公钥
     */
    const getPublicKey = {
        method: "get",
        routor: "/getPublicKey",
        describe: "获取公钥",
        callback: async function (res) {
            const key = new NodeRSA({ b: 1024 }); //生成2048位的密钥

            let publicDer1 = key.exportKey("pkcs1-public-pem");  //公钥 
            let privateDer1 = key.exportKey("pkcs1-private-pem");//私钥 
            rsa.push({
                public: publicDer1,
                private: privateDer1,
                key: key
            })


            var public_key = fs.readFileSync(path.join(__dirname, '../../pem/rsa_public_key.pem'));
            const encrypted = key2.encrypt(public_key.toString(), 'base64');
            res.send(response.jsonData({
                success: true,
                data: {
                    public_key: encrypted
                }
            }));
        }
    }

    /**
     * 获取Token
     */
    const getToken = {
        method: "post",
        routor: "/getToken",
        describe: "获取Token",
        callback: async function (req, res) {
            req.body.publickey = key2.decrypt(req.body.publicKey, 'utf8');
            req.body.publickey = Buffer.from(req.body.publickey);
            var jwt = new jwtutil(req.body);
            var token = jwt.generateToken();
            res.send(response.jsonData({
                success: true,
                data: {
                    token: token
                }
            }));
        }
    }

    module.exports.getPublicKey = getPublicKey;
    module.exports.getToken = getToken;
    module.exports.description = "权鉴机制";
})();