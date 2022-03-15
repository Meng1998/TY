'use strict';
var onwebControl;
var onwebControlhf;
var pubKey = '';
var pubKey1 = '';
var bIE = !!window.ActiveXObject || 'ActiveXObject' in window; // 是否为IE浏览器
var config = {
    appkey: "26192019",
    secret: "UcwVIQ0oPYEcHSzgizIq",
    ip: "192.0.1.150",
    buttonIDs: "0,16,256,257,258,259,260,512,515,516,517,768,769",
    port: 443,
    // playMode: 0, //预览 
    enableHttps: 1,
    encryptedFields: "secret",
    showSmart: 1,
    showToolbar: 1,
    snapDir: "D:\SnapDir",
    videoDir: "D:\VideoDir",
}
//初始化
var VideoPlugin = function () {
    function initPlugin(code,index,startTime,endTime) {
        onwebControl= new WebControl({
              szPluginContainer: 'playWnd',
              iServicePortStart: 15900,
              iServicePortEnd: 15909,
              cbConnectSuccess: function () {
                  onwebControl.JS_StartService('window', {
                          dllPath: './VideoPluginConnect.dll',
                      })
                      .then(function () {
                          onwebControl.JS_CreateWnd('playWnd', 500, 300).then(function () {
                            getPubKey(function () {
                                function setEncrypt (value) {
                                    var encrypt = new JSEncrypt();
                                    encrypt.setPublicKey(pubKey);
                                    return encrypt.encrypt(value);
                                }
                                onwebControl.JS_RequestInterface({
                                    funcName: 'init',
                                    argument: JSON.stringify({
                                        appkey: config.appkey,
                                        secret: setEncrypt(config.secret),
                                        ip: config.ip,
                                        port: config.port,
                                        playMode: index,
                                        layout: '1x1',
                                        enableHTTPS: config.enableHttps,
                                        buttonIDs: config.buttonIDs,
                                        encryptedFields: config.encryptedFields,
                                        showSmart: config.showSmart,
                                        showToolbar: config.showToolbar,
                                        snapDir: config.snapDir,
                                        videoDir: config.videoDir,
                                    }),
                                })
                                .then(function (oData) {
                                    if(index==0){
                                        playvide(code)   
                                    }else{
                                        playback1(code,startTime,endTime)
                                    }  
                                });
                            })
                          });
                      });
              },
              cbConnectError: function () {
                  console.log('初始化失败');
              },
              cbConnectClose: function () {
                  console.log('cbConnectClose');
              },
          });
      }

      function getPubKey (callback) {
        onwebControl.JS_RequestInterface({
            funcName: "getRSAPubKey",
            argument: JSON.stringify({
                keyLength: 1024,
            })
        }).then(function (oData) {
            console.log(oData)
            if (oData.responseMsg.data) {
                 pubKey = oData.responseMsg.data
                callback()
            }
        })
    }
      function playvide(code){
        onwebControl.JS_RequestInterface({
            funcName: 'startPreview',
            argument: JSON.stringify({
                cameraIndexCode:code,
                streamMode: 1,
                transMode: 1,
                gpuMode: 0,
                wndId: 1,
            }),
        })
        .then(function (oData) {
            var messsge = JSON.stringify(
                oData ? oData.responseMsg : ''
            );
            console.log(messsge);
            console.log('11111');
        });
      }
      function playback1(code,startTime,endTime){
        var startTimeStamp = new Date(startTime.replace('-', '/').replace('-', '/')).getTime();
        var endTimeStamp = new Date(endTime.replace('-', '/').replace('-', '/')).getTime();
        console.log(startTimeStamp)
        onwebControl.JS_RequestInterface({
            funcName: "startPlayback",
            argument: JSON.stringify({
                cameraIndexCode: code, // 监控点编号
                startTimeStamp: Math.floor(startTimeStamp / 1000).toString(), // 录像查询开始时间戳，单位：秒
                endTimeStamp: Math.floor(endTimeStamp / 1000).toString(), // 录像查询结束时间戳，单位：秒
                recordLocation: 0, // 录像存储类型 0-中心存储 1-设备存储
                transMode: 1, // 传输协议 ，0-UDP 1-TCP
                gpuMode: 0 ,// 是否开启 GPU 硬解，0-不开启 1-开启
                wndId:1
            })
        }).then(function (oData) {
            var messsge= JSON.stringify(oData ? oData.responseMsg : '')
            console.log(messsge)
        });
      }
     function xioahuisp(){
         console.log("1211")
         onwebControl.JS_HideWnd();// 先让窗口隐藏，规避插件窗口滞后于浏览器消失问题
         onwebControl.JS_Disconnect().then(function(){
        // 断开与插件服务连接成功
         onwebControl=undefined;
        }, function() { 
        // 断开与插件服务连接失败
        });
}
    var methodSet = {
        initPlugin:initPlugin,
        playvide:playvide,
        playback1:playback1,
        xioahuisp:xioahuisp,
    };
    window.DemomethodSet = methodSet;
}(window);
 