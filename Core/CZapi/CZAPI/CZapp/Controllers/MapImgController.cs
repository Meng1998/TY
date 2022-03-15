using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CZapp.C;
using CZapp.model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace CZapp.Controllers
{

    [Route("MapImg")]
    [ApiController]
    public class MapImgController : ControllerBase
    {
        /// <summary>
        /// 查询监控图像
        /// </summary>
        /// <param name="devicecode"></param>
        /// <returns></returns>
        [Route("GetImg")]
        [HttpGet]
        public result GetImg(String devicecode)
        {
            return getImg.SelectImgdata(devicecode);
        }

        /// <summary>
        /// 图像数据入库
        /// </summary>
        /// <returns></returns>
        [Route("ImgDataWarehousing")]
        [HttpPost]
        public JObject ImgDataWarehousing()
        {
            //string path = file.FileName;
            
            return getImg.WarehousInsData();
        }
        /// <summary>
        /// 以图搜图
        /// </summary>
        /// <param name="file"></param>
        [Route("CaptureSearch")]
        [HttpPost]
       public JObject CaptureSearch([FromBody] Captureface captureface)
        {
            //var fff = "." + DateTime.Now.ToString("fff");
            //captureface.startTime = DateTime.Parse(captureface.startTime).ToString("s") + fff + "+08:00";
            //captureface.endTime = DateTime.Parse(captureface.endTime).ToString("s") + fff + "+08:00";
            //return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "200", data = captureface }));

            return getImg.CaptureSearchMsg(JsonConvert.SerializeObject(captureface), 3);
        }


        /// <summary>
        /// 返回Hik请求信息
        /// </summary>
        /// <param name="file"></param>
        [Route("Hiktest")]
        [HttpPost]
        public JObject Hiktest(Int32 index)
        {
            

            return new C.Hik.HIKoperation().HIKTeststr(0,index);
        }


        /// <summary>
        /// ISC动态请求传ID
        /// </summary>
        /// <param name="file"></param>
        [Route("HikISCrequestInfo")]
        [HttpPost]
        public JObject HikISCrequestInfo([FromBody]Infolist infolist)
        {
            JObject data = getImg.CaptureSearchMsgstr(infolist.data, null, infolist.urlindex);
            Log.Debug(data.ToString());
            return data;
        }

        /// <summary>
        /// ISC动态请求传地址
        /// </summary>
        /// <param name="file"></param>
        [Route("HikISCrequestAddress")]
        [HttpPost]
        public JObject HikISCrequestAddress([FromBody] addlist infolist)
        {
            JObject data= getImg.CaptureSearchMsgstr(infolist.data, infolist.urlindex,-1);
            Log.Debug(data.ToString());
            return data;
        }
    }
}
