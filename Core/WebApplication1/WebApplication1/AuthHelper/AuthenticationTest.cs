using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.AuthHelper
{
    public class AuthenticationTest: IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            Console.WriteLine("我是Authorization过滤器");
            //请求的地址
            var url = context.HttpContext.Request.Path.Value;
            #region 打印头部信息
            var heads = context.HttpContext.Request.Headers;
            string msg = string.Empty;

            foreach (var item in heads)
            {
                msg += item.Key + ":" + item.Value + "\r\n";
            }

            Console.WriteLine("我是heads：" + msg);
            #endregion
        }
    }


    public class ValidateLoginFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            int? uid = filterContext.HttpContext.Session.GetInt32("userId");
            if (uid == null || uid <= 0)
            {
                filterContext.Result = new RedirectResult("/Account/Login");
            }
            base.OnActionExecuting(filterContext);
        }
    }

}
