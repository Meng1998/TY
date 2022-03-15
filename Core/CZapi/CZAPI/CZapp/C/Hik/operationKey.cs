
using CZapp.model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace CZapp.C.Hik



{
    class operationKey
    {

        GetDataSet GetSetData = new GetDataSet();
        /// <summary>
        /// 对key操作
        /// </summary>
        /// <param name="Url"></param>
        /// <param name="key"></param>
        /// <param name="Parameter"></param>
        /// <param name="error"></param>
        /// <returns></returns>
        public String GetKeyHttpPostRaw(String Url, SecretKey key, JToken Parameter, out Boolean error,Int32 type)
        {
            //加密秘钥
            String Encryptionkey = GetSetData.GetencryptionKey(key);
            String Data;
            switch (type)
            {//DateTime.Now.ToString("yyyy-MM-dd")
                case 8:
                    
                    Data =Post.HIKHttpPostRaw(Url, JsonConvert.SerializeObject(Parameter), GetDataSet.getTimeStr(), Encryptionkey, key.appKey, out error);
                    break;
                default:
                     Data = Post.HIKHttpPostRaw(Url, JsonConvert.SerializeObject(Parameter), GetDataSet.getTimeStr(), Encryptionkey, key.appKey, out error);
                    break;
            }
           
            if (error)
                return Data;
            else
                return "报错异常 : " + Data;
        }

        /// <summary>
        /// 对key操作
        /// </summary>
        /// <param name="Url"></param>
        /// <param name="key"></param>
        /// <param name="Parameter"></param>
        /// <param name="error"></param>
        /// <returns></returns>
        public String GetKeyHttpPostRaw(String Url, SecretKey key, String Parameter, out Boolean error, Int32 type)
        {
            //加密秘钥
            String Encryptionkey = GetSetData.GetencryptionKey(key);
            String Data;
            switch (type)
            {//DateTime.Now.ToString("yyyy-MM-dd")
                case 8:

                    Data = Post.HIKHttpPostRaw(Url, Parameter, GetDataSet.getTimeStr(), Encryptionkey, key.appKey, out error);
                    break;
                default:
                    
                    Data = Post.HIKHttpPostRaw(Url, Parameter, GetDataSet.getTimeStr(), Encryptionkey, key.appKey, out error);
                    break;
            }

            if (error)
                return Data;
            else
                return "报错异常 : " + Data;
        }


        /// <summary>  
        /// 本地时间转成GMT时间  
        /// </summary>  
        public static string ToGMTString(DateTime dt)
        {
            return dt.ToUniversalTime().ToString("r");
        }




    }
}