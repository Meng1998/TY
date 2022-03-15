"use strict";

/**
 * 钉钉开放平台
 */
(function () {

    const response = require("../../middleware/response");
    const model = require("../../model/main")("work_bustrip", "work_leave");
    const Sequelize = require("../../dao/sequelizeDao");
    const tools = require("../../utils/tools");
    const config = require("config");
    const request = require("request");

    var access_token = null;

    /**
     * 钉钉开发平台接口地址
     */
    const apiUrl = {
        gettoken: "https://oapi.dingtalk.com/gettoken?appkey={0}&appsecret={1}",
        user: {
            list: "https://oapi.dingtalk.com/topapi/v2/user/list?access_token={0}",
            listsimple: "https://oapi.dingtalk.com/topapi/user/listsimple?access_token={0}"
        },
        department: {
            listsubid: "https://oapi.dingtalk.com/topapi/v2/department/listsubid?access_token={0}"
        },
        attendance: {
            list: "https://oapi.dingtalk.com/attendance/list?access_token={0}"
        }
    }

    //#region 基础方法

    /**
     * 验证token有效性
     */
    async function getToken() {
        if (tools.isEmpty(access_token)) {
            //获取token
            access_token = await requestToken();
        } else {
            //token超时验证
            var differ = access_token.request_time.differNow("second");
            if (differ > access_token.timeout) {
                //超时
                access_token = await requestToken();
            } else if (differ > (access_token.timeout / 2)) {//超过一半时间更新
                //异步更新
                httpRequest().then(function (response) {
                    if (response) {
                        access_token = {
                            timeout: response.expires_in,//超时时间
                            request_time: new Date(),//请求时间
                            access_token: response.access_token//token
                        }
                    }
                });
            }
        }

        return access_token.access_token;

        //请求token
        async function requestToken() {
            const appkey = config.get("dingtalk.appkey");
            const appsecret = config.get("dingtalk.appsecret");

            var url = tools.placeholder(apiUrl.gettoken, [appkey, appsecret]);
            var response = await httpRequest(url);
            return {
                timeout: JSON.parse(response).expires_in,//超时时间
                request_time: new Date(),//请求时间
                access_token: JSON.parse(response).access_token//token
            }
        }
    }

    /**
     * 执行http请求
     * @param {object|string} options 传入参数
     */
    async function httpRequest(options) {
        if (tools.isObject(options)) {
            options.method = "POST";//设置post请求
        }
        if (!options) {
            debugger;
            return;
        }
        return new Promise(function (resolve, reject) {
            request(options, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 拼接请求地址
     * @param {string} url 请求地址
     */
    async function getUrl(url) {
        var token = await getToken();
        return tools.placeholder(url, [token]);
    }

    //#endregion

    //#region 通讯录

    /**
     * 获取所有用户
     */
    async function getAllUser() {
        var url;
        //获取所有部门
        url = await getUrl(apiUrl.department.listsubid);
        var department = await httpRequest({
            url: url,
            formData: {
                dept_id: 1,
            }
        });

        var request = JSON.parse(department);
        if (request.errcode && request.errcode === 88) {
            return request.sub_msg;
        }

        //根据部门获取人员
        var departments = request.result.dept_id_list;
        departments.push(1);
        var user_list = [];
        url = await getUrl(apiUrl.user.listsimple);
        for (let j = 0; j < departments.length; j++) {
            const department = departments[j];
            var users = await httpRequest({
                url: url,
                formData: {
                    dept_id: department,
                    cursor: 0,
                    size: 50
                }
            });
            user_list = user_list.concat(JSON.parse(users).result.list);
        }
        return user_list;
    }

    /**
     * 根据名称获取用户
     */
    const userByNameSimple = {
        method: "post",
        routor: "/dingtalk/user/userByNameSimple",
        describe: "根据名称获取用户",
        callback: async function (req, res) {
            var user_list = await getAllUser();
            if (tools.isArray(user_list)) {
                for (let i = 0; i < user_list.length; i++) {
                    const user = user_list[i];
                    if (user.name === req.body.user_name) {
                        res.send(response.jsonData({
                            success: true,
                            data: user
                        }));
                        return;
                    }
                }
                res.send(response.jsonData({
                    success: false,
                    data: null,
                    msg: "未找到用户"
                }));
            } else {
                var msg = user_list;
                res.send(response.jsonData({
                    success: false,
                    data: null,
                    msg: msg
                }));
            }
        }
    }

    //#endregion

    //#region 考勤打卡

    async function getAttendanceList(options) {
        var url = await getUrl(apiUrl.attendance.list);
        options.limit = 50;
        options.offset = 0;
        var attendancelist = [];
        while (true) {
            var attendance = await httpRequest({
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(options)
            });
            var result = JSON.parse(attendance);
            if (result.errcode) {
                console.log(result.errmsg);
            }
            attendancelist = attendancelist.concat(result.recordresult);
            if (result.hasMore) {
                options.offset += options.limit;
            } else {
                break;
            }
        }

        return attendancelist;
    }

    /**
     * 获取打卡结果
     * @param {object} attendance 考勤信息
     */
    function timeResultFormat(attendance) {
        switch (attendance.timeResult) {
            case "Normal":
                return "正常";
            case "Early":
                return "早退";
            case "Late":
                var date = new Date(attendance.userCheckTime);
                var onDuty = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 31, 0);
                if (date > onDuty) {
                    return "迟到";
                } else {
                    attendance.timeResult = "Normal";
                    return "正常";
                }
            case "SeriousLate":
                return "严重迟到";
            case "Absenteeism":
                return "矿工迟到";
            case "NotSigned":
                return "未打卡";
        }
    }

    /**
     * 获取今日打卡结果
     */
    const sameDayAttendanceList = {
        method: "post",
        routor: "/dingtalk/attendance/sameDayAttendanceList",
        describe: "获取今日打卡结果",
        callback: async function (req, res) {
            var users = JSON.parse(req.body.users);
            var userIds = [];
            //获取钉钉userId列表
            for (let j = 0; j < users.length; j++) {
                const user = users[j];
                userIds.push(user.ding_userid);
            }
            var options = {
                userIdList: userIds,
                workDateFrom: tools.date.nowDate() + " 08:00:00",
                workDateTo: tools.date.nowDate() + " 23:59:59"
                // workDateFrom: "2021-1-6 08:00:00",
                // workDateTo: "2021-1-6 23:59:59"
            }

            var recordresult = await getAttendanceList(options);

            var attendanceList = [];//考勤记录数组
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                var record = {
                    user_name: user.full_name//人员名称
                }

                //遍历打卡记录数据
                for (let j = 0; j < recordresult.length; j++) {
                    const attendance = recordresult[j];
                    if (!attendance) {
                        continue;
                    }
                    if (user.ding_userid === attendance.userId) {
                        switch (attendance.checkType) {
                            case "OnDuty":
                                record.OnDuty = tools.date.dateFormat(new Date(attendance.userCheckTime));
                                record.OnDutyTimeResultText = timeResultFormat(attendance);
                                record.OnDutyTimeResult = attendance.timeResult;
                                break;
                            case "OffDuty":
                                record.OffDuty = tools.date.dateFormat(new Date(attendance.userCheckTime));
                                record.OffDutyTimeResultText = timeResultFormat(attendance);
                                record.OffDutyTimeResult = attendance.timeResult;
                                break;
                        }
                        //已匹配的数据删除 提高运算效率
                        recordresult.remove(attendance);
                        j--;//下标自减
                    }
                }
                attendanceList.push(record);
            }

            res.send(response.jsonData({
                success: true,
                data: attendanceList
            }));
        }
    }

    /**
     * 根据月份获取考勤
     */
    const attendanceForMonth = {
        method: "post",
        routor: "/dingtalk/attendance/attendanceForMonth",
        describe: "根据月份获取考勤",
        callback: async function (req, res) {
            var body = req.body;
            var users;
            if (tools.isArray(req.body.users)) {
                users = req.body.users;
            } else {
                users = JSON.parse(req.body.users);
            }
            var userIds = [];
            //获取钉钉userId列表
            for (let j = 0; j < users.length; j++) {
                const user = users[j];
                userIds.push(user.ding_userid);
            }
            var options = {
                userIdList: userIds
            }

            var start_time = new Date(body.start_time);//起始时间
            var end_time = new Date(body.end_time);//结束时间
            var days = ((end_time - start_time) / (1 * 24 * 60 * 60 * 1000)) + 1;//获取相差天数
            var current_date = tools.date.dateFormat(start_time, "yyyy-MM-dd");//当前循环时间
            var begin_date = tools.date.dateFormat(start_time, "yyyy-MM-dd");

            var num = 1;//查询天数：钉钉平台接口最多查询7天

            var attendanceList = [];//考勤记录数组
            if (days <= 7) {
                await restructure(start_time, end_time);
            } else {
                //获取时间段
                for (let i = 1; i <= days; i++) {
                    if (i === days && num !== 7) {
                        num--;
                        await restructure(begin_date, current_date);
                    } else if (num === 7) {
                        await restructure(begin_date, current_date);
                        num = 0;
                        begin_date = tools.date.getNextDay(current_date);
                    }
                    current_date = tools.date.getNextDay(current_date);
                    num++;
                    //查询数据
                }
            }

            /**
             * 查询数据
             */
            async function restructure(start_time, end_time) {
                options.workDateFrom = tools.date.dateFormat(new Date(start_time), "yyyy-MM-dd 08:00:00");
                options.workDateTo = tools.date.dateFormat(new Date(end_time), "yyyy-MM-dd 23:59:59");

                var recordresult = await getAttendanceList(options);
                attendanceList = attendanceList.concat(recordresult);
            }

            /**
             * 通用验证条件
             */
            var condition = new Sequelize.Options();
            condition.setOrder({ start_time: "DESC" });
            condition.options.where = {
                [Sequelize.Op.or]: [
                    [Sequelize.where(Sequelize.col('start_time'), ">=", body.start_time), Sequelize.where(Sequelize.col('start_time'), "<=", body.end_time)],
                    [Sequelize.where(Sequelize.col('start_time'), "<=", body.start_time), Sequelize.where(Sequelize.col('end_time'), ">=", body.end_time)],
                    [Sequelize.where(Sequelize.col('end_time'), ">=", body.start_time), Sequelize.where(Sequelize.col('end_time'), "<=", body.end_time)],
                    [Sequelize.where(Sequelize.col('end_time'), "=", null)]
                ]
            }

            //外勤/差旅，请假查询
            //差旅信息
            const work_bustrip = await model.work_bustrip();
            var work_bustrip_list = await work_bustrip.findAll(condition.getOptionsNoPage());

            //请假信息
            const work_leave = await model.work_leave();
            var work_leave_list = await work_leave.findAll(condition.getOptionsNoPage());

            //数据拼装
            var recordList = [];
            for (let j = 0; j < users.length; j++) {
                const user = users[j];
                var record = {
                    user_name: user.full_name//人员名称
                }
                for (let j = 0; j < attendanceList.length; j++) {
                    const attendance = attendanceList[j];
                    if (!attendance) {
                        continue;
                    }
                    if (user.ding_userid === attendance.userId) {
                        var date = tools.date.dateFormat(new Date(attendance.userCheckTime), "yyyy-MM-dd");

                        var userCheckTime = tools.date.dateFormat(new Date(attendance.userCheckTime));
                        var timeResultText = timeResultFormat(attendance);
                        var timeResult = attendance.timeResult;
                        var bustripInfo = null;
                        var bustripPlace = null;

                        //非正常状态
                        if (timeResult !== "Normal") {
                            //查询是否存在外勤/差旅
                            for (let k = 0; k < work_bustrip_list.length; k++) {
                                const work_bustrip = work_bustrip_list[k];
                                if (work_bustrip.user_id === user.id) {
                                    if (work_bustrip.end_time) {
                                        //出差已结束
                                        //出差中
                                        if (date.toDate() >= work_bustrip.start_time.toDate() && date.toDate() <= work_bustrip.end_time.toDate()) {
                                            timeResultText = "外勤";
                                            timeResult = "Bustrip";
                                            bustripInfo = work_bustrip;
                                            bustripPlace = getPlace(work_bustrip);
                                        }
                                    } else {
                                        //出差中
                                        if (date.toDate() >= work_bustrip.start_time.toDate()) {
                                            timeResultText = "外勤";
                                            timeResult = "Bustrip";
                                            bustripInfo = work_bustrip;
                                            bustripPlace = getPlace(work_bustrip);
                                        }
                                    }
                                }

                                function getPlace(data) {
                                    //直辖市显示到市级
                                    if (data.province_name === "北京市" || data.province_name === "天津市" || data.province_name === "上海市" || data.province_name === "重庆市") {
                                        return data.province_name;
                                    }
                                    //杭州市内显示到区级
                                    if (data.city_name === "杭州市" && data.county_name) {
                                        return data.county_name;
                                    }
                                    if (tools.isNotEmpty(data.city_name)) {
                                        return data.city_name;
                                    } if (tools.isNotEmpty(data.province_name)) {
                                        return data.province_name;
                                    }
                                }
                            }

                            //查询是否存在请假
                            for (let k = 0; k < work_leave_list.length; k++) {
                                const work_leave = work_leave_list[k];
                                if (work_leave.user_id === user.id) {
                                    if (work_leave.end_time) {
                                        //出差已结束
                                        //出差中
                                        if (date.toDate() >= tools.date.dateFormat(work_leave.start_time, "yyyy-MM-dd").toDate() && date.toDate() <= tools.date.dateFormat(work_leave.end_time, "yyyy-MM-dd").toDate()) {
                                            timeResultText = "请假";
                                            timeResult = "Leave";
                                        }
                                    } else {
                                        //出差中
                                        if (date.toDate() >= work_leave.start_time) {
                                            timeResultText = "请假";
                                            timeResult = "Leave";
                                        }
                                    }
                                }
                            }
                        }

                        switch (attendance.checkType) {
                            case "OnDuty":
                                record[date + "_" + "OnDuty"] = userCheckTime;
                                record[date + "_" + "OnDutyTimeResultText"] = timeResultText;
                                record[date + "_" + "OnDutyTimeResult"] = timeResult;
                                if (bustripInfo) {
                                    record[date + "_" + "OnDutyBustripInfo"] = bustripInfo;
                                    record[date + "_" + "OnDutyBustripPlace"] = bustripPlace;
                                }
                                break;
                            case "OffDuty":
                                record[date + "_" + "OffDuty"] = userCheckTime;
                                record[date + "_" + "OffDutyTimeResultText"] = timeResultText;
                                record[date + "_" + "OffDutyTimeResult"] = timeResult;
                                if (bustripInfo) {
                                    record[date + "_" + "OffDutyBustripInfo"] = bustripInfo;
                                    record[date + "_" + "OffDutyBustripPlace"] = bustripPlace;
                                }
                                break;
                        }
                        //已匹配的数据删除 提高运算效率
                        attendanceList.remove(attendance);
                        j--;//下标自减
                    }
                }
                recordList.push(record);
            }

            var data = {
                list: recordList,
                count: recordList.length
            }
            res.send(response.jsonData({
                success: true,
                data: data
            }));
        }
    }

    //#endregion

    module.exports.userByNameSimple = userByNameSimple;
    module.exports.attendanceForMonth = attendanceForMonth;
    module.exports.sameDayAttendanceList = sameDayAttendanceList;
    module.exports.description = "钉钉开放平台";
})();