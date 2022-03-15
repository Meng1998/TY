using System;
using System.Collections.Generic;
using System.Text;

namespace CZapp.model
{
    public class SecretKey
    {
        //三个必要的通信参数
        public String Context { get; set; }
        public String API { get; set; }
        public Int32 Port { get; set; }
        public String Host { get; set; }
        public String appKey { get; set; }
        public String appSecret { get; set; }

    }

    public class DHSecretKey
    {
        //三个必要的通信参数
        public Int32 Port { get; set; }
        public String Host { get; set; }
        public String user { get; set; }
        public String pwd { get; set; }
        public String API { get; set; }

    }
}
