using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.server
{
    public class Account : IAccountServices
    {
        public string Context()
        {
            // throw new NotImplementedException();
            return "拿到接口服务";
        }
    }
}
