import { Ueapi as UEUrl,token as Token,ProjectId as projectId}  from '../../api/address' 
  /* global MapVision */
  var view3d = new MapVision.View3d({
    id: 'mapvision3d',
    url: UEUrl,
    projectId: projectId,
    token:Token
});
var socket;
export const Common = {
    openClick() {
        view3d.Open();
        setTimeout(function(){
            SetResolution('mapvision3d', view3d);
            XZClick();

        },2000)
        socket = new WebSocket('ws://127.0.0.1:1177');
        socket.onopen="Video Open.."
    },
    flyto(code){
         //console.log(code)
         view3d.FlyToObjectById(code, false);
    },
    FGmodel(buildingName,gvisible){
        view3d.SetBuildingVisible(buildingName, gvisible);//建筑
    },
    DHmodel(dhName,gvisible){
        view3d.UpdateObjectVisible(dhName, gvisible);//对象
    },
    ZTDHInit(){
        view3d.UpdateObjectVisible('XHYD', false);
        view3d.UpdateObjectVisible('XHED', false);
        view3d.UpdateObjectVisible('CMYD', false);
        view3d.UpdateObjectVisible('CMED', false);
        view3d.UpdateObjectVisible('menkou', false);
    },
    btn2Click() {
        XZClick();
    },
    SetResolution(options) {
            if (view3d) {
                var divObj = document.getElementById(options);
                if (!divObj) {
                    // alert("error");
                    return;
                }
                var width = divObj.clientWidth;
                var height = divObj.clientHeight;
                view3d.SetResolution(width, height);
            }
    },
    getlocation(){
        var alt= {"x":11300.181640625,"y":15541.2109375,"z":2878.060546875,"pitch":18.841888427734375,"yaw":-87.84357452392578,"roll":0.0000297697915812023,"distance":7882.6376953125};
        view3d.FlyToPosition(alt, false);
    },
    Getsend(code){
        socket.send(JSON.stringify({"type":"play","cameraCode":code}))
    }  

}
//设置屏幕
function SetResolution(options, view3d) {
        if (view3d) {
            var divObj = document.getElementById(options);
            if (!divObj) {
                // alert("error");
                return;
            }
            var width = divObj.clientWidth;
            var height = divObj.clientHeight;
            view3d.SetResolution(width, height);
        }
    }

function XZClick() {
        // 过滤 对象  prefix 对象名称前缀   ，path 路径前缀
        let paramers = {
            prefix: 'MP,V,0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p',
            path: '',
            speedroute: 10
        };
        let code="";
        view3d.SetParameters(paramers);
        view3d.SetMouseCallback(res => {
            // localStorage.setItem('duix',res.gid);
            code=res.gid;
            if(code.length>30){
                DwMap(res.gid)
                window.postMessage(res, '*');
                debugger
                socket.send(JSON.stringify({"type":"play","cameraCode":code.split('_')[0]}));
            }
            console.log(res);

        });
    }

function DwMap(code){
    view3d.FlyToObjectById(code, false);
    XZClick();
}  
