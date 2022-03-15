// create the global ue4(...) helper function
"object" != typeof ue && (ue = {}), uuidv4 = function () { return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (t) { return (t ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> t / 4).toString(16) }) }, ue4 = function (r) { return "object" != typeof ue.interface || "function" != typeof ue.interface.broadcast ? (ue.interface = {}, function (t, e, n, o) { var u, i; "string" == typeof t && ("function" == typeof e && (o = n, n = e, e = null), u = [t, "", r(n, o)], void 0 !== e && (u[1] = e), i = encodeURIComponent(JSON.stringify(u)), "object" == typeof history && "function" == typeof history.pushState ? (history.pushState({}, "", "#" + i), history.pushState({}, "", "#" + encodeURIComponent("[]"))) : (document.location.hash = i, document.location.hash = encodeURIComponent("[]"))) }) : (i = ue.interface, ue.interface = {}, function (t, e, n, o) { var u; "string" == typeof t && ("function" == typeof e && (o = n, n = e, e = null), u = r(n, o), void 0 !== e ? i.broadcast(t, JSON.stringify(e), u) : i.broadcast(t, "", u)) }); var i }(function (t, e) { if ("function" != typeof t) return ""; var n = uuidv4(); return ue.interface[n] = t, setTimeout(function () { delete ue.interface[n] }, 1e3 * Math.max(1, parseInt(e) || 0)), n });

Aimap = function () {

}
// 飞行到具体id的建筑
Aimap.prototype.FlyTo = function (id) {
   //ue4("GoToMesh", "MB_CYYL11020")
   ue4("GoToMesh", id)
}

// 飞行到具体id的建筑，但不显示Tip
Aimap.prototype.FlyToNoTip = function (id) {
   //ue4("GoToMeshNoTip", "MB_CYYL11020")
   ue4("GoToMeshNoTip", id)
}

//获取id的坐标, 传入callback函数来处理loc坐标
Aimap.prototype.GetLocation = function (id , callback) {
   //ue4("GetLocation", "MB_CYYL11020")
   ue4("GetLocation", id, function (loc) {
      callback(loc)
   })
}

//获取开始坐标, 传入callback函数来处理坐标
Aimap.prototype.GetStartLocation = function (callback) {
   ue4("GetStartLocation", function (loc) {
      callback(loc)
   })
}

//创建路径 [{ x: 11, y: 22, z:33 }, { }]
Aimap.prototype.CreatePath = function (arr) {
   ue4("CreatePath", arr)
}

//行走路径 [{ x: 11, y: 22, z:33 }, { }]
Aimap.prototype.GoWithPath = function (arr) {
   ue4("GoWithPath", arr)
}

//停止正在进行的行走路径
Aimap.prototype.StopGoPath = function () {
   ue4("StopGoPath")
}

//设置camera回到场景设置的初始位置
Aimap.prototype.ResetCamera = function() {
   ue4("ResetCamera")
}

//移除路径
Aimap.prototype.RemovePath = function() {
   ue4("RemovePath")
}

//移除定位标点
Aimap.prototype.RemoveTip = function() {
   ue4("RemoveTip")
}

//打印消息， data为json格式
Aimap.prototype.Print = function(data, callback){
   // ue4("print",
   // {
   //     "browser": navigator.userAgent,
   //     "time": Date.now()
   // },
   // function (version) {
   //     if (typeof version == "string")
   //         document.querySelector('#print').innerText = "Unreal Engine " + version.split('-')[0];
   // });
   ue4("Print",
   data,
   callback);
}

var Aimapvision = new Aimap()