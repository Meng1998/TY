"use script";

/**
 * Maintain服务相关
 * @author LYW
 */
(function () {
    function uptime() {
        return {
            current: new Date(),
            uptime: function () {
                var diffSeconds = process.uptime();
                var calcMinutes = diffSeconds / 60;
                var calcHours = calcMinutes / 60;
                var days = Math.floor(calcHours / 24);
                var hours = Math.floor(calcHours - (days * 24));
                var minutes = Math.floor(calcMinutes - (days * 60 * 24) - (hours * 60));
                var seconds = Math.floor(diffSeconds % 60);

                function pad(number) {
                    if (number < 10) {
                        return `0${number}`;
                    } else {
                        return number;
                    }
                }

                return {
                    days: pad(days),
                    hours: pad(hours),
                    minutes: pad(minutes),
                    seconds: pad(seconds)
                };
            }()
        }
    }

    module.exports.uptime = uptime;
})();