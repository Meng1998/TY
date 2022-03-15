"use strict";

/**
 * Token校验类
 */
(function () {

    const config = require("config");
    const fs = require('fs');
    const path = require('path');
    const jwt = require("jsonwebtoken");

    /**
     * token工具类
     */
    class jwtutil {

        /**
         * 构造方法
         * @param {object} [option] 传入参数
         * @param {string} [option.token] token值
         * @param {string} [option.secret] 密钥
         * @param {string} [option.publicKey] 公钥
         */
        constructor(option) {
            //获取secret
            this.token = option.token;
            this.secret = option.secret;
            this.publickey = option.publickey;
            this.privatekey = fs.readFileSync(path.join(__dirname, '../pem/rsa_private_key.pem'));
        }

        /**
         * 生成token
         */
        generateToken() {
            var secret = this.secret;
            var created = Math.floor(Date.now() / 1000);
            var cert = this.privatekey;//私钥 可以自己生成
            var token = jwt.sign({
                secret,
                exp: created + 60 * 30,
            }, cert, {
                algorithm: "RS256"
            });
            return token;
        }

        // 校验token
        verifyToken() {
            var token = this.token;
            var cert = this.publickey;//公钥 可以自己生成
            var res;
            try {
                let result = jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};
                let { exp = 0 } = result, current = Math.floor(Date.now() / 1000);
                if (current <= exp) {
                    res = result.data || {};
                }
            } catch (e) {
                res = false;
            }
            return res;
        }
    }

    module.exports = jwtutil;
})();