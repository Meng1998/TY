using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace WebApplication1.AuthHelper
{
    public static class SwaggerServiceExtensions
    {

       
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services, IConfiguration Configuration)
        { 

            //将Swagger生成器添加到服务集合
            services.AddSwaggerGen(c =>
            {
                //定义接口文档的标题、版本、描述信息
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "EFCoreMigration项目的接口文档", Version = "v1.0", Description = "该接口文档会保持最新同步，可以直接在此做接口调试" });
                //不推荐使用ApiKeyScheme，在版本5以上，推荐使用OpenApiSecurityScheme
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                //就是这里
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{typeof(Startup).Assembly.GetName().Name}.xml"), true);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                        //或者是下面这样
                        //Array.Empty<string>()
                    }
                });

            });
            //跨域服务？
            services.AddCors(m => m.AddPolicy("any", a => a.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
            #region 【简单授权】
            #region 1、基于角色的API授权 

            // 1【授权】、这个很简单，其他什么都不用做，
            // 无需配置服务，只需要在API层的controller上边，增加特性即可，注意，只能是角色的:
            // [Authorize(Roles = "Admin")]

            // 2【认证】、然后在下边的configure里，配置中间件即可:app.UseMiddleware<JwtTokenAuth>();但是这个方法，无法验证过期时间，所以如果需要验证过期时间，还是需要下边的第三种方法，官方认证

            #endregion

            #region 2、基于策略的授权（简单版）

            // 1【授权】、这个和上边的异曲同工，好处就是不用在controller中，写多个 roles 。
            // 然后这么写 [Authorize(Policy = "Admin")]
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Client", policy => policy.RequireRole("Client").Build());
                options.AddPolicy("Admin", policy => policy.RequireRole("Admin").Build());
                options.AddPolicy("SystemOrAdmin", policy => policy.RequireRole("Admin", "System"));
            });


            // 2【认证】、然后在下边的configure里，配置中间件即可:app.UseMiddleware<JwtTokenAuth>();但是这个方法，无法验证过期时间，所以如果需要验证过期时间，还是需要下边的第三种方法，官方认证
            #endregion
            #endregion


            #region 【认证】
            //读取配置文件
            var audienceConfig = Configuration.GetSection("Audience");
            //var symmetricKeyAsBase64 = audienceConfig["Secret"];
            //var keyByteArray = Encoding.ASCII.GetBytes(symmetricKeyAsBase64);
            //var signingKey = new SymmetricSecurityKey(keyByteArray);


            //3.1【认证】
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(audienceConfig["Secret"])),
                    ValidIssuer = audienceConfig["Issuer"],
                    ValidAudience = audienceConfig["Audience"],
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            #endregion

            return services;
        }
        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                //指定Swagger JSON文件的URL
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                //指定Swagger JSON文件的URL，也就是说可以添加多个版本
                //c.SwaggerEndpoint("/swagger/v2/swagger.json", "My API V2");

                //c.DocExpansion("none");
            });
            app.UseCors("any");
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            return app;
        }
    }
}
