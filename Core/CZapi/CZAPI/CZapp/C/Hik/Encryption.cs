using Serilog;
using System;
using System.Text;
using System.Timers;

namespace CZapp.C.Hik
{
    class Encryption
    {
        Timer cTimer = new Timer();
        /// <summary>
        /// HMACSHA256 =》 Base64
        /// </summary>
        /// <param name="message">内容</param>
        /// <param name="secret">秘钥</param>
        /// <returns></returns>
        public static string CreateToken(string message, string secret)
        {
            secret = secret ?? "";
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = encoding.GetBytes(secret);
            byte[] messageBytes = encoding.GetBytes(message);
            using (var hmacsha256 = new System.Security.Cryptography.HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                return Convert.ToBase64String(hashmessage);
            }
        }
        /// <summary>
        /// 设置程序重启
        /// </summary>
        public void InitRestart() {
            cTimer.Interval = 3000;
            cTimer.Elapsed += Restart;
            //cTimer.AutoReset = false;
            cTimer.Start();
        }
        /// <summary>
        /// 重启自己
        /// </summary>
        private void Restart(object sender, ElapsedEventArgs e)
        {
            //重启时间设定
            int h = DateTime.Now.Hour;
            int m = DateTime.Now.Minute;
            int s = DateTime.Now.Second;
            int h1 = 2;//2
            int m1 = 0;//0
            int s1 = 0;
            int s2 = 5;
            if (h == h1 && m == m1 && s >= s1 && s <= s2)
            {
                Log.Debug("软件重启" + System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName);
                // Restart current process Method 1
                Console.Clear();
                System.Diagnostics.Process.Start(System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName);
                System.Diagnostics.Process.GetCurrentProcess().Kill();

            }
        }
        /// <summary>
        /// Base64
        /// </summary>
        /// <param name="message">内容</param>
        /// <returns></returns>
        public static string CreateBase64(string message)
        {
            byte[] keyByte = Encoding.UTF8.GetBytes(message);

            return Convert.ToBase64String(keyByte);
        }

        public static string GetMD5(string myString)
        {
            System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            //byte[] fromData = System.Text.Encoding.Unicode.GetBytes(myString);
            byte[] fromData = System.Text.Encoding.UTF8.GetBytes(myString);//
            byte[] targetData = md5.ComputeHash(fromData);
            string byte2String = null;

            for (int i = 0; i < targetData.Length; i++)
            {
                //这个是很常见的错误，你字节转换成字符串的时候要保证是2位宽度啊，某个字节为0转换成字符串的时候必须是00的，否则就会丢失位数啊。不仅是0，1～9也一样。
                //byte2String += targetData[i].ToString("x");//这个会丢失
                byte2String = byte2String + targetData[i].ToString("x2");
            }

            return byte2String;
        }


        /// <summary>
        /// 用MD5加密字符串
        /// </summary>
        /// <param name="password">待加密的字符串</param>
        /// <returns></returns>
        public static string MD5Encrypt(string password)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider md5Hasher = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] hashedDataBytes;
            hashedDataBytes = md5Hasher.ComputeHash(Encoding.UTF8.GetBytes(password));
            StringBuilder tmp = new StringBuilder();
            foreach (byte i in hashedDataBytes)
            {
                tmp.Append(i.ToString("x2"));
            }
            return tmp.ToString();
        }
    }
}
