"use script";

/**
 * Maintain服务相关
 * @author LYW
 */
(function () {
    var os = require("os");
    const osName = require("os-name");
    const osUptime = require("os-uptime")();
    const winRelease = require('win-release');

    const internalIp = require("internal-ip").v4();
    const publicIp = require("public-ip").v4();
    const netmask = require("ipmask")();

    var currCPU = 0;

    /**
     * 基础信息
     */
    async function basic() {
        return {
            os: {
                platform: osName().split(" ")[0],
                release: winRelease(),
                uptime: osUptime
            },
            cpu: os.cpus()[0].model,
            processor: os.cpus()[0].model.replace("CPU ", "").replace(/\(.*?\)/g, ""),
            architecture: os.arch(),
            total_mem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
            hostname: os.hostname(),
            local_ip: await internalIp,
            public_ip: await publicIp,
            network_mask: netmask.netmask,
            mac: netmask.mac,
        }
    }

    /**
     * 监听系统资源
     */
    function monitor() {
        /**
         * 获取CPU使用率
         */
        getCPUUsage(function (value) {
            currCPU = value;
        });

        return osInfo(currCPU)
    }

    /**
     * 获取服务器信息
     */
    function osInfo(currCPU) {
        var freemem = os.freemem() / 1024 / 1024 / 1024;
        var totalmem = os.totalmem() / 1024 / 1024 / 1024;
        return {
            cpu_usage: (currCPU * 100.0).toFixed(2) + "%",//CPU使用率
            free_mem: freemem.toFixed(2) + " GB",//空闲内存
            total_mem: totalmem.toFixed(2) + " GB",//内存大小
            used_mem: (totalmem - freemem).toFixed(2) + " GB",//已用内存
            mem_usage: ((totalmem - freemem) / totalmem * 100.0).toFixed(2) + "%",//使用率
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
        function getCPUInfo() {
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

    module.exports.basic = basic;
    module.exports.monitor = monitor;
})();