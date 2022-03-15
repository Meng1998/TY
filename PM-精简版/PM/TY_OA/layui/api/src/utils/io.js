"use strict";

/**
 * IO操作类
 */
(function () {
    const path = require('path');
    const fs = require("fs");

    /**
     * 创建目录
     * @param {string} path 目录路径
     * @returns 创建结果
     */
    function createDir(dirPath) {

        //判断路径是否存在
        var exists = fs.existsSync(dirPath);

        if (exists) {
            //获取目录
            var stat = fs.statSync(dirPath);

            //判断当前目录是否存在并且为文件夹
            if (stat && stat.isDirectory()) {
                return new result(true, "already");
            } else {
                //目录为文件时删除
                fs.unlinkSync(dirPath);
            }
        }

        var dirArr = dirPath.split("\\");
        //设置根节点
        var current = dirArr[0];
        //判断盘符是否存在
        if (!fs.existsSync(current)) {
            return new result(false, "no such disk symbol");
        }
        //遍历目录节点
        dirArr.forEach((dir, index) => {
            if (index !== 0) {
                //目录拼接
                current = path.join(current, dir);
                if (!fs.existsSync(current)) {
                    //创建目录
                    fs.mkdirSync(current);
                }
            }
        });

        return new result(true);
    }

    /**
     * 复制文件到指定目录
     * @param {string} sourceFile 源文件目录
     * @param {string} destFile 目标目录
     * @param {string} fileName 文件名
     */
    function copyFile(sourceFile, destFile, fileName) {

        //判断路径是否存在
        var exists = fs.existsSync(sourceFile);
        if (exists) {
            //获取文件
            var stat = fs.statSync(sourceFile);

            //判断当前文件是否存在
            if (!stat.isFile()) {
                return new result(false, "no such file");
            }
        } else {
            return new result(false, "no such file");
        }

        //创建文件目录
        var rlt = createDir(destFile);
        if (!rlt.success) {
            return rlt;
        }

        //复制文件
        fs.copyFileSync(sourceFile, path.join(destFile, fileName));
        
        return new result(true);
    }


    /**
     * 返回结果
     * @class
     */
    class result {
        constructor(rlt, msg = "success") {
            this.success = rlt;
            this.message = msg;
        }
    }

    module.exports.createDir = createDir;
    module.exports.copyFile = copyFile;
})();