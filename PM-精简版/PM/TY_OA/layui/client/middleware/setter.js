"use script";

/**
 * 全局配置
 */
layui.define(function (exports) {

    var loginTimeout = false; //登录超时时间，为空是 不设置登录超时
    var tokenVerify = false;//是否启用token验证
    var secret = "410af04e4b24bd8674f5c10c0987c6e8";//密钥

    var debug = true;//是否开启调试模式

    //接口路径
    var uri = {
        environment: "DEV",//当前环境
        //开发环境配置
        DEV: {
            api: "http://localhost:8090",//API接口地址
            socket: "ws://localhost:8091",//WebSocket服务地址
            maintain: "ws://localhost:8092"//Maintain服务地址
        },
        //整合环境配置
        SIT: {
            api: "http://192.168.0.80:8090",//API接口地址
            socket: "ws://192.168.0.80:8091",//WebSocket服务地址
            maintain: "ws://192.168.0.80:8092"//Maintain服务地址
        },
        //生产环境配置
        PRD: {
            api: "http://www.aimapvision.com:9989",//API接口地址
            socket: "ws://www.aimapvision.com:8095",//WebSocket服务地址
            maintain: "ws://www.aimapvision.com:8096"//Maintain服务地址
        }
    }

    //数据表格
    var table = {
        limit: 20,//每页显示的条数
        limits: [20, 40, 60, 80, 100],//每页条数的选择项
        selected: "layui-bg-blue"
    }

    //皮肤主题
    var theme = {
        //内置主题配色方案
        color: [
            {
                main: '#20222A', //主题色
                selected: '#009688', //选中色
                alias: 'default' //默认别名
            },
            {
                main: '#03152A',
                selected: '#3B91FF',
                alias: 'dark-blue' //藏蓝
            },
            {
                main: '#2E241B',
                selected: '#A48566',
                alias: 'coffee' //咖啡
            },
            {
                main: '#50314F',
                selected: '#7A4D7B',
                alias: 'purple-red' //紫红
            }, {
                main: '#344058',
                logo: '#1E9FFF',
                selected: '#1E9FFF',
                alias: 'ocean' //海洋
            },
            {
                main: '#3A3D49',
                logo: '#2F9688',
                selected: '#5FB878',
                alias: 'green' //墨绿
            },
            {
                main: '#20222A',
                logo: '#F78400',
                selected: '#F78400',
                alias: 'red' //橙色
            },
            {
                main: '#28333E',
                logo: '#AA3130',
                selected: '#AA3130',
                alias: 'fashion-red' //时尚红
            },
            {
                main: '#24262F',
                logo: '#3A3D49',
                selected: '#009688',
                alias: 'classic-black' //经典黑
            },
            {
                logo: '#226A62',
                header: '#2F9688',
                alias: 'green-header' //墨绿头
            },
            {
                main: '#344058',
                logo: '#0085E8',
                selected: '#1E9FFF',
                header: '#1E9FFF',
                alias: 'ocean-header' //海洋头
            },
            {
                header: '#393D49',
                alias: 'classic-black-header' //经典黑头
            },
            {
                main: '#50314F',
                logo: '#50314F',
                selected: '#7A4D7B',
                header: '#50314F',
                alias: 'purple-red-header' //紫红头
            },
            {
                main: '#28333E',
                logo: '#28333E',
                selected: '#AA3130',
                header: '#AA3130',
                alias: 'fashion-red-header' //时尚红头
            },
            {
                main: '#28333E',
                logo: '#009688',
                selected: '#009688',
                header: '#009688',
                alias: 'green-header' //墨绿头
            }
        ],
        //初始的颜色索引，对应上面的配色方案数组索引
        //如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
        initColorIndex: 14
    }

    var dictionary = {
        EducationType: "40558a70-3237-11eb-90c4-6b19fca42c2d",//人员学历类型
        EnableStatus: "c5dd3210-3237-11eb-90c4-6b19fca42c2d",//功能菜单启用状态
        LeaveType: "7b6615d0-3237-11eb-90c4-6b19fca42c2d",//人员请假类型
        ApprovalStatus: "b9ff2bb0-3237-11eb-90c4-6b19fca42c2d",//请假审批状态
        RoleType: "8d362ca0-3237-11eb-90c4-6b19fca42c2d",//客户角色类型
        BustripType: "83cafb00-3237-11eb-90c4-6b19fca42c2d",//人员出差类型
        ProjectStatus: "ce48a6f0-3237-11eb-90c4-6b19fca42c2d",//项目状态
        ContractStatus: "0093dda0-3238-11eb-90c4-6b19fca42c2d",//项目合同状态
        ProjectType: "99851d40-3237-11eb-90c4-6b19fca42c2d",//项目类型
        FollowStatus: "da182e60-3237-11eb-90c4-6b19fca42c2d",//项目跟进状态
        FinishStatus: "08f1bdf0-3238-11eb-90c4-6b19fca42c2d",//项目反馈完成状态
        FeedbackType: "7a624c50-4f81-11eb-862e-b7e0025ccfdc",//项目反馈类型
        InvoiceStatus: "1443d800-3238-11eb-90c4-6b19fca42c2d",//合同开票状态
        CollectStatus: "1a602cc0-3238-11eb-90c4-6b19fca42c2d",//合同收款状态
        VehicleType: "79c15a70-7088-11eb-9f8e-d9d474c4ee86",//交通工具
        AuthorizeStatus: "d1bd7090-2746-11ec-b6dd-1d247a6ec055"//项目授权状态
    }

    var other = {
        dept: {//部门Id
            project_manager: "a53c3b30-bbc9-11ea-b9ee-f5f1d3668986",//项目经理
        },
        role: [//角色Id
            { roleId: "52c91840-bbca-11ea-b9ee-f5f1d3668986", feedback: "model" },//数据资源一部主管
            { roleId: "5e6867f0-bbca-11ea-b9ee-f5f1d3668986", feedback: "model" },//数据资源二部主管
            { roleId: "7859cb40-bbca-11ea-b9ee-f5f1d3668986", feedback: "develop" },//项目开发部主管
            { roleId: "816577c0-bbca-11ea-b9ee-f5f1d3668986", feedback: "develop" },//技术开发部主管
            { roleId: "8f220220-bbca-11ea-b9ee-f5f1d3668986", feedback: "develop" },//综合开发部主管
        ],
        user: {//人员Id
            xuxj: "c2a0fde0-bbca-11ea-b9ee-f5f1d3668986",//徐小建
            liff: "cbea5e10-c47a-11ea-a65d-8317e8b94d02",//李帆帆
        },
        bus: "8e4157d0-41f6-11ec-8a6b-77ea457934a5"//商务人事
    }

    exports("setter", {
        tokenVerify: tokenVerify,//是否启用token验证
        loginTimeout: loginTimeout,//登录超时时间，为空是 不设置登录超时
        secret: secret,//密钥 
        debug: debug,//调试模式
        uri: uri,//接口路径
        table: table,//数据表格
        theme: theme,//主题配置
        dictionary: dictionary,//字典配置
        other: other//其他
    });
});
