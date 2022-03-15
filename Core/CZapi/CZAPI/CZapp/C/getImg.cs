using CZapp.C.Hik;
using CZapp.Drt;
using CZapp.model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CZapp.C
{
    public class getImg
    {
        public static result SelectImgdata(String devicecode)
        {
            try
            {
                String sql = "";
                if (devicecode != "" && devicecode != null)
                    sql = $"select * from \"map_deviceurl\" where devicecode='{devicecode}'";
                else
                    sql = $"select * from \"map_deviceurl\"";
                DataTable data = new Drt.Pgsql().PgExecute(sql).Tables[0];
                return new result() {Code="200",Data= data }; 
            }
            catch (Exception)
            {
                return new result() { Code = "500", Data = null };
            }
        }

        public static JObject WarehousInsData()
        {
            try
            {

                String pathfile = Directory.GetCurrentDirectory() + "\\Img";
                String[] pathinfo = Directory.GetCurrentDirectory().Split('\\');
                String handpath = pathinfo[pathinfo.Length - 1] + "/Img";
                //Console.WriteLine(pathfile);
                //Console.WriteLine("url2:"+ Directory.GetCurrentDirectory()+ "\\Img");
                Int32 index = new Directoryfile().Filepath(pathfile, handpath);
                if (index > -1)
                {
                    return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "200", data = "入库完成,已导入："+ index+"条" }));
                }
                else
                {
                    return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "400", data = "数据更新失败" }));
                }
            }
            catch (Exception)
            {
                return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "500", data = "路径下未找到文件" }));
            }
        }

        public static JObject CaptureSearchMsg(String data, Int32 msgid)
        {
            try
            {

                String msg = new HIKoperation().HIKGETDATA(data, out _, 0, msgid);

                return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "200", data = msg }));

            }
            catch (Exception)
            {
                return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "500", data = "服务器连接异常" }));
            }
        }

        public static JObject CaptureSearchMsgstr(JObject data, String msgid,Int32 id)
        {
            try
            {
                GetDataSet.DynamicusermodelList.API = msgid;
                String msg = new HIKoperation().HIKGETDATA(data, out _,0, id);

                return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "200", data = msg }));

            }
            catch (Exception)
            {
                return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "500", data = "服务器连接异常" }));
            }
        }



    }
}
