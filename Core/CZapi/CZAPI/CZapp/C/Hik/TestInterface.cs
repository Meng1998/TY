using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CZapp.C.Hik
{
    /// <summary>
    /// 测试海康接口状态是否正常
    /// </summary>
    class TestInterface
    {

        static GetDataSet GetSetData = new GetDataSet();//海康key数据处理类


        private async Task<String> DataInit()
        {
            var list = await Task.Run(() => ISC_SPCCTEST());

            return list;
        }
        private String ISC_SPCCTEST()
        {

            String errors = null;
            var Object = new
            {
                parameter = new
                {
                    pageNo = 1,
                    pageSize = 2,
                    treeCode = 0
                }
            };

            String parameter = new HIKoperation().HIKGETDATA(JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(Object))["parameter"], out Boolean error, 0, 12);
            try
            {

                if (error && GetSetData.GetmsgSuccessfulState(JsonConvert.DeserializeObject<JObject>(parameter)["msg"].ToString()))
                {
                    errors += ($"ISC platform connection is normal");
                }
                else
                {
                    errors += $"ISC connection error ：Interface timeout / interface returned error / key error. Please follow the above points to find problems！";//接口超时/接口返回错误/密钥错误。 请按照以上几点寻找问题点
                }
            }
            catch (Exception ex)
            {
                errors += ($"ISC connection error： {ex.Message}");
            }

            parameter = new HIKoperation().HIKGETDATA(JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(Object))["parameter"], out error, 1, 1);
            try
            {
                if (error && GetSetData.GetmsgSuccessfulState(JsonConvert.DeserializeObject<JObject>(parameter)["msg"].ToString()))
                {
                    errors += ($"SPCC platform connection is normal");
                }
                else
                {
                    errors += ($"SPCC connection error ：Interface timeout / interface returned error / key error. Please follow the above points to find problems！");//接口超时/接口返回错误/密钥错误。 请按照以上几点寻找问题点
                }
            }
            catch (Exception ex)
            {
                errors += ($"SPCC connection error： {ex.Message}");
            }

            return errors;
        }
        public TestInterface()
        {
            //Console.Title = "是否启动海康ISC/SPCC服务(YES启动NO不启动).";//设置窗口标题
            Log.Debug($"Check ISC / SPCC interface(YES/NO):");
            String condition = Console.ReadLine().ToUpper();//接受控制台输入的一个字符串

            if (!String.IsNullOrEmpty(condition) && condition == "YES" || condition == "NO")
                if (condition == "YES" ? !true : !false)
                    return;
                else
                    ;
            else
                return;


            Boolean forbl = true;
            Task<String> t = DataInit();


            Task.Run(async () =>
            {
                String msg = await t;
                forbl = false;
                Thread.Sleep(200);
                Console.SetCursorPosition(0, Console.CursorTop);
                Log.Debug(msg + "Detection completed!" + Environment.NewLine);//检测完成
            });

            while (forbl)
            {
                for (int i = 0; i <= 5; i++)
                {
                    if (!forbl)
                        break;
                    Thread.Sleep(100);
                    Log.Debug("                    ");
                    Console.SetCursorPosition(0, Console.CursorTop - 1);
                    string msg = null;
                    for (int a = 0; a < i; a++)
                    {
                        msg += ".";
                    }
                    Log.Debug("Waiting for detection" + msg);
                }
            }
            Thread.Sleep(200);

        }


    }
}
