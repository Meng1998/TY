import $ from 'jquery';
var UrlMain;
var UEUrl;
var Url;
var UrlIfream;
var Token;
var projectId;

$.ajax({
    url: "./config.json",
    type: "get",
    async: false,
    success: function (response) {
        let projectAddrass = window.location.host;
        console.log('%c config.json配置:',"color: red;font-size:13px",response)
        console.log('%c 本机IP:',"color: blue;font-size:13px",projectAddrass)
        // 返回当前的URL协议,既http协议还是https协议
        // let protocol = document.location.protocol;
        // const interfaceIp = `${protocol}//${projectAddrass}/api`;
        UrlMain= response.UrlMain;
        Url= response.Url;
        UEUrl= response.UEUrl;
        UrlIfream=response.UrlIfream;
        Token=response.Token;
        projectId=response.projectId;
    }
})
export var api=UrlMain;
export var map=Url;
export var Ueapi=UEUrl;
export var UeIfm=UrlIfream;
export var token=Token;
export var ProjectId=projectId;