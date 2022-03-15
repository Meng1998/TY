

using CZapp.model;
using Microsoft.Extensions.Configuration;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace CZapp.C.Hik
{
    /// <summary>
    /// 集合工具类 对ISC接口操作
    /// </summary>
    public class GetDataSet
    {
        private static List<SecretKey> ISCusermodelList = new List<SecretKey>();

        private static List<SecretKey> SPCCusermodelList = new List<SecretKey>();

        public static SecretKey DynamicusermodelList = new SecretKey();

        private static String TimeStr = null;//同步时间
        #region 同步时间
        public static string getTimeStr()
        {
            return TimeStr;
        }
        public static void setTimeStr(String time)
        {
            TimeStr = time;
        }
        #endregion
        #region 初始化key
        /// <summary>
        /// 初始化参数
        /// </summary>
        public Boolean InitParameters()
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // <== compile failing here
            .AddJsonFile("appsettings.json");
            try
            {
                List<SecretKey> usermodelListKey = new List<SecretKey>();
                SecretKey Key = new SecretKey();
                {


                    IConfiguration configuration = builder.Build();
                    DynamicusermodelList=new SecretKey(){
                        API = "",
                        Context = configuration[$"ISCKeyList:KeyContext"],
                        Port = Int32.Parse(configuration[$"ISCKeyList:KeyPort"]),
                        Host = configuration[$"ISCKeyList:KeyHost"],
                        appKey = configuration[$"ISCKeyList:KeyappKey"],
                        appSecret = configuration[$"ISCKeyList:KeyappSecret"]
                    };

                    for (int i = 1; i < 1000; i++)
                    {
                        if (configuration[$"ISCKeyList:{i}KeyAPI"] == "STOP")
                        {
                            break;
                        }

                        usermodelListKey.Add(new SecretKey()
                        {
                            API = configuration[$"ISCKeyList:{i}KeyAPI"],
                            Context = configuration[$"ISCKeyList:KeyContext"],
                            Port = Int32.Parse(configuration[$"ISCKeyList:KeyPort"]),
                            Host = configuration[$"ISCKeyList:KeyHost"],
                            appKey = configuration[$"ISCKeyList:KeyappKey"],
                            appSecret = configuration[$"ISCKeyList:KeyappSecret"]
                        });
                    }

                }//初始化ISCkey
                ISCusermodelList = new List<SecretKey>(usermodelListKey);
                usermodelListKey.Clear();
                {
                    //IConfiguration configuration = new ConfigurationBuilder().Add(new JsonConfigurationSource
                    //{
                    //    Path = "appsettings.json",
                    //    ReloadOnChange = true
                    //}).Build();
                    IConfiguration configuration = builder.Build();

                    for (int i = 1; i < 1000; i++)
                    {
                        if (configuration[$"SPCCKeyList:{i}KeyAPI"] == "STOP")
                        {
                            break;
                        }
                        usermodelListKey.Add(new SecretKey()
                        {
                            Context = configuration[$"SPCCKeyList:KeyContext"],
                            API = configuration[$"SPCCKeyList:{i}KeyAPI"],
                            Port = Int32.Parse(configuration[$"SPCCKeyList:KeyPort"]),
                            Host = configuration[$"SPCCKeyList:KeyHost"],
                            appKey = configuration[$"SPCCKeyList:KeyappKey"],
                            appSecret = configuration[$"SPCCKeyList:KeyappSecret"]
                        });
                    }

                }//初始化SPCCkey
                SPCCusermodelList = new List<SecretKey>(usermodelListKey);

                return true;

            }
            catch (Exception ex)
            {

                Log.Debug($"Error reporting anomaly：{ex.Message}");

                return false;

            }

        }
        #endregion

        /// <summary>
        /// 获取ISC密钥
        /// </summary>
        /// <param name="type">获取类型 0是ISC，1是SPCC</param>
        /// <returns></returns>
        public Object KEY(Int32 type)
        {
            switch (type)
            {
                case 0:
                    return ISCusermodelList;
                case 1:
                    return SPCCusermodelList;

                default:
                    return -1;
            }
        }
        /// <summary>
        /// 返回链接字符串
        /// </summary>
        /// <returns></returns>
        public String StitchingParameters(SecretKey key)
        {

            String HostCharacterString = $"{key.Host}:{key.Port}{key.Context}{key.API}";
            return HostCharacterString;
        }
        /// <summary>
        /// 获取ISC密钥
        /// </summary>
        /// <param name="index">获取什么接口的</param>
        /// <param name="type">获取的数据类型</param>
        /// <returns></returns>
        public SecretKey GetISCkey(Int32 index, Int32 type)
        {

            SecretKey key = new SecretKey();


            switch (type)
            {
                case 0:
                    return new SecretKey()
                    {
                        Port = ISCusermodelList[index].Port,
                        Host = ISCusermodelList[index].Host,
                        appKey = ISCusermodelList[index].appKey,
                        Context = ISCusermodelList[index].Context,
                        API = ISCusermodelList[index].API,
                        appSecret = ISCusermodelList[index].appSecret

                    };
                case 1:
                    return new SecretKey()
                    {
                        Port = SPCCusermodelList[index].Port,
                        Host = SPCCusermodelList[index].Host,
                        appKey = SPCCusermodelList[index].appKey,
                        Context = SPCCusermodelList[index].Context,
                        API = SPCCusermodelList[index].API,
                        appSecret = SPCCusermodelList[index].appSecret
                    };

            }

            return key;
        }
        /// <summary>
        /// 海康接口返回状态是否正确
        /// </summary>
        /// <param name="state"></param>
        /// <returns></returns>
        public Boolean GetmsgSuccessfulState(String state)
        {

            if (state == "success" || state == "SUCCESS" || state == "Operation succeeded")
                return true;
            else
                return false;
        }
        /// <summary>
        /// 获取加密密钥
        /// </summary>
        /// <returns></returns>
        public String GetencryptionKey(SecretKey key)
        {
            String Encryptionkey = EncryptionPostData(key.appKey, key.Context, key.API, key.appSecret);

            return Encryptionkey;
        }
       
        #region Psot 字段加密操作
        /// <summary>
        /// 取到加密秘钥字段
        /// </summary>
        /// <param name="Key">AppKey</param>
        /// <param name="ApiUrl">Api的连接</param>
        /// <param name="appSecret">appSecret</param>
        /// <returns></returns>
        public String EncryptionPostData(String Key, String ApiUrlTop, String ApiUrl, String appSecret)
        {
            TimeStr = DateTime.Now.ToString("R");
            //var Host = "POST\n*/*\napplication/json\nSat, 23 Nov 2019 07:58:36 GMT\nx-ca-key:26488016\n/artemis/api/frs/v1/resource/recognition";///artemis/api/resource/v1/regions/subRegions

            String Host = $"POST\n*/*\napplication/json\n{TimeStr}\nx-ca-key:{Key}\n{ApiUrlTop + ApiUrl}";///artemis/api/resource/v1/regions/subRegions
            String EncryptingKey = CreateToken(Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(Host)), appSecret);
            setTimeStr(TimeStr);
            return EncryptingKey;
        }

        /// <summary>
        /// HMACSHA256 =》 Base64
        /// </summary>
        /// <param name="message">内容</param>
        /// <param name="secret">秘钥</param>
        /// <returns></returns>
        private string CreateToken(string message, string secret)
        {
            secret = secret ?? "";
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = encoding.GetBytes(secret);
            byte[] messageBytes = encoding.GetBytes(message);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                return Convert.ToBase64String(hashmessage);
            }
        }
        #endregion

    }
}
