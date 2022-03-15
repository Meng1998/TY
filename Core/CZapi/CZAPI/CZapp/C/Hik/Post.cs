using Serilog;
using System;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace CZapp.C.Hik
{
    class Post
    {
      
        //post登入数据
        public static String HttpPost(String Url, String postDataStr, ref Boolean isSuccess)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.ContentLength = Encoding.UTF8.GetByteCount(postDataStr);
                //request.CookieContainer = cookie;
                Stream myRequestStream = request.GetRequestStream();
                StreamWriter myStreamWriter = new StreamWriter(myRequestStream, Encoding.GetEncoding("utf-8"));
                myStreamWriter.Write(postDataStr);
                myStreamWriter.Close();

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                //response.Cookies = cookie.GetCookies(response.ResponseUri);
                Stream myResponseStream = response.GetResponseStream();
                StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
                string retString = myStreamReader.ReadToEnd();
                myStreamReader.Close();
                myResponseStream.Close();

                return retString;
            }
            catch (Exception e)
            {
                isSuccess = false;
                Log.Debug(e.Message);
                return e.Message;
            }
        }
        /// <summary>
        /// POST整个字符串到URL地址中
        /// </summary>
        /// <param name="Url">Post链接地址</param>
        /// <param name="jsonParas">json数据</param>
        /// <param name="TimeStr">当前系统时间(GMT格式)</param>
        /// <param name="EncryptionKey">签名</param>
        /// <param name="AK">APPkey(AK秘钥)</param>
        /// <param name="isSuccess">方法是否正确拿到数据</param>
        /// <returns></returns>
        public static String HIKHttpPostRaw(String Url, String jsonParas, String TimeStr, String EncryptionKey, String AK, out Boolean isSuccess)
        {
            string strURL = Url; isSuccess = true;

          
            //创建一个HTTP请求 
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; //声明协议

            //处理Https请求
            // 准备请求...
            // 设置参数
            if (Url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
            {
                //处理Https请求
                ServicePointManager.ServerCertificateValidationCallback =
                new RemoteCertificateValidationCallback(CheckValidationResult);
                request = WebRequest.Create(Url) as HttpWebRequest;
                request.ProtocolVersion = HttpVersion.Version10;
            }
            CookieContainer cookieContainer = new CookieContainer();

            //设置四秒超时
            //request.Timeout = 3000; //单位毫秒
            //Post请求方式 
            request.Method = "POST";
            //内容类型
            request.Headers.Add("X-Ca-Signature", EncryptionKey);//秘钥
            request.Headers.Add("X-Ca-Key", AK);//AppKey
            request.Accept = "*/*";
            request.Date = Convert.ToDateTime(TimeStr);
            request.ContentType = "application/json";
            request.Headers.Add("X-Ca-Signature-Headers", "x-ca-key");
            //设置参数，并进行URL编码
            string paraUrlCoded = jsonParas;//System.Web.HttpUtility.UrlEncode(jsonParas);  
            byte[] payload;
            //将Json字符串转化为字节 
            payload = System.Text.Encoding.UTF8.GetBytes(paraUrlCoded);
            //设置请求的ContentLength  
            request.ContentLength = payload.Length;
            //发送请求，获得请求流
            Stream writer;
            try
            {
                writer = request.GetRequestStream();//获取用于写入请求数据的Stream对象
            }
            catch (Exception)
            {
                writer = null;
                Log.Debug("连接服务器失败!");
            }
            try
            {
                //将请求参数写入流
                writer.Write(payload, 0, payload.Length);
                writer.Close();//关闭请求流
                               //String strValue = "";//strValue为http响应所返回的字符流
                HttpWebResponse response;
                try
                {
                    //request.Timeout = 3000; //单位毫秒 超时
                    //获得响应流
                    response = (HttpWebResponse)request.GetResponse();
                }
                catch (WebException ex)
                {
                    try
                    {
                        isSuccess = false;
                        response = ex.Response as HttpWebResponse;
                    }
                    catch (Exception exs)
                    {
                        return exs.Message;//错误
                    }

                }
                Stream s = response.GetResponseStream();
                StreamReader sRead = new StreamReader(s);
                string postContent = sRead.ReadToEnd();
                sRead.Close();
                return postContent;//返回Json数据
            }
            catch (Exception ex)
            {
                isSuccess = false;
                return ex.Message;//错误
            }



        }

      
        public static String GTHttpPostRaw(String Url, out Boolean isSuccess, String jsonParas = null)
        {
            isSuccess = true;
            string strURL = Url;
            //创建一个HTTP请求 
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; //声明协议
            // 准备请求...
            // 设置参数
            if (Url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
            {
                //处理Https请求
                ServicePointManager.ServerCertificateValidationCallback =
                new System.Net.Security.RemoteCertificateValidationCallback(CheckValidationResult);
                request = WebRequest.Create(Url) as HttpWebRequest;
                request.ProtocolVersion = HttpVersion.Version10;
            }


            CookieContainer cookieContainer = new CookieContainer();

            request.Method = "POST";
            request.ContentType = "application/json";
            //设置参数，并进行URL编码
            string paraUrlCoded = jsonParas;//System.Web.HttpUtility.UrlEncode(jsonParas);  
            byte[] payload;
            //将Json字符串转化为字节 
            payload = System.Text.Encoding.UTF8.GetBytes(paraUrlCoded);
            //设置请求的ContentLength  
            request.ContentLength = payload.Length;
            //发送请求，获得请求流
            Stream writer;
            try
            {
                writer = request.GetRequestStream();//获取用于写入请求数据的Stream对象
            }
            catch (Exception)
            {
                writer = null;
                Log.Debug("连接服务器失败!");
            }
            try
            {
                //将请求参数写入流
                writer.Write(payload, 0, payload.Length);
                writer.Close();//关闭请求流
                               //String strValue = "";//strValue为http响应所返回的字符流
                HttpWebResponse response;
                try
                {
                    //request.Timeout = 5000; //单位毫秒
                    //获得响应流
                    response = (HttpWebResponse)request.GetResponse();
                }
                catch (WebException ex)
                {
                    try
                    {
                        isSuccess = false;
                        response = ex.Response as HttpWebResponse;
                    }
                    catch (Exception exs)
                    {
                        return exs.Message;//错误
                    }

                }
                Stream s = response.GetResponseStream();
                StreamReader sRead = new StreamReader(s);
                string postContent = sRead.ReadToEnd();
                sRead.Close();
                return postContent;//返回Json数据
            }
            catch (Exception ex)
            {
                isSuccess = false;
                return ex.Message;//错误
            }



        }


        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
        {
            return true;
        }
        public static String HttpPostObject(String Url, String jsonParas, String TimeStr, String EncryptionKey, String AK, out Boolean isSuccess)
        {
            string strURL = Url; isSuccess = true;
            //创建一个HTTP请求 
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; //声明协议

            //处理Https请求
            // 准备请求...
            // 设置参数
            if (Url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
            {
                //处理Https请求
                ServicePointManager.ServerCertificateValidationCallback =
                new RemoteCertificateValidationCallback(CheckValidationResult);
                request = WebRequest.Create(Url) as HttpWebRequest;
                request.ProtocolVersion = HttpVersion.Version10;
            }
            CookieContainer cookieContainer = new CookieContainer();
            //设置网页可重新定位
            //request.AllowAutoRedirect = true;
            //设置四秒超时
            //request.Timeout = 3000; //单位毫秒
            //Post请求方式 
            request.Method = "POST";
            //内容类型
            request.Headers.Add("X-Ca-Signature", EncryptionKey);//秘钥
            request.Headers.Add("X-Ca-Key", AK);//AppKey
            request.Accept = "*/*";
            request.Date = Convert.ToDateTime(TimeStr);
            request.ContentType = "application/json";
            request.Headers.Add("X-Ca-Signature-Headers", "x-ca-key");
            //设置参数，并进行URL编码
            string paraUrlCoded = jsonParas;//System.Web.HttpUtility.UrlEncode(jsonParas);  
            byte[] payload;
            //将Json字符串转化为字节 
            payload = System.Text.Encoding.UTF8.GetBytes(paraUrlCoded);
            //设置请求的ContentLength  
            request.ContentLength = payload.Length;
            //发送请求，获得请求流
            Stream writer;
            try
            {
                writer = request.GetRequestStream();//获取用于写入请求数据的Stream对象
            }
            catch (Exception)
            {
                writer = null;
                Log.Debug("连接服务器失败!");
            }
            try
            {
                //将请求参数写入流
                writer.Write(payload, 0, payload.Length);
                writer.Close();//关闭请求流
                               //String strValue = "";//strValue为http响应所返回的字符流
                HttpWebResponse response;
                try
                {
                    //获得响应流
                    response = (HttpWebResponse)request.GetResponse();
                }
                catch (WebException ex)
                {

                    response = ex.Response as HttpWebResponse;
                }
                try
                {
                    var Content = response.Headers["location"];
                    if (String.IsNullOrEmpty(Content)) {
                        Content = response.ResponseUri.AbsoluteUri;
                        return Content;//返回Json数据
                    }
                    return Content;//返回Json数据

                }
                catch (Exception)
                {
                    try
                    {
                        var Content = response.ResponseUri.AbsoluteUri;
                        return Content;//返回Json数据
                    }
                    catch (Exception esx)
                    {
                        isSuccess = false;
                        return $"error:{esx.Message}";//返回Json数据
                    }

                }


            }
            catch (Exception ex)
            {
                isSuccess = false;
                //Log.WriteLog("图片接收数据：", ex.Message);
                return $"error:{ex.Message}";//返回Json数据
            }



        }
        /// <summary> 
        /// 将 Stream 转成 byte[] 
        /// </summary> 
        public static byte[] StreamToBytes(Stream stream)
        {
            byte[] bytes = new byte[stream.Length];
            stream.Read(bytes, 0, bytes.Length);

            // 设置当前流的位置为流的开始 
            stream.Seek(0, SeekOrigin.Begin);
            return bytes;
        }
        public static MemoryStream StreamTOMemoryStream(Stream inStream)
        {
            MemoryStream ms = new MemoryStream();
            byte[] buffer = new byte[1024];

            while (true)
            {
                int sz = inStream.Read(buffer, 0, 1024);
                if (sz == 0) break;
                ms.Write(buffer, 0, sz);
            }
            ms.Position = 0;
            return ms;
        }
        public static String ImageTOBase64(byte[] imageFile)
        {
            byte[] byteArray = imageFile;
            return Convert.ToBase64String(byteArray);
        }
    }

}
