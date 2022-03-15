"use strict";

/**
 * AES加密解密
 */
(function(){

    const crypto = require("crypto-js");
    
    /**
     * AES加密
     * @param {string} word 加密字符串
     * @param {string} key 密钥
     * @param {string} iv 初始向量 initial vector 16 位
     */
    function encrypt(word, key, iv) {
        let srcs = crypto.enc.Utf8.parse(word);
        let encrypted = crypto.AES.encrypt(srcs, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
        return encrypted.ciphertext.toString().toUpperCase();
    }

    /**
     * AES解密
     * @param {string} word 解密字符串
     * @param {string} key 密钥
     * @param {string} iv 初始向量 initial vector 16 位
     */
    function decrypt(word, key, iv) {
        let encryptedHexStr = crypto.enc.Hex.parse(word);
        let srcs = crypto.enc.Base64.stringify(encryptedHexStr);
        let decrypt = crypto.AES.decrypt(srcs, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
        let decryptedStr = decrypt.toString(crypto.enc.Utf8);
        return decryptedStr.toString();
    }
    
    module.exports.encrypt = encrypt;
    module.exports.decrypt = decrypt;
})();