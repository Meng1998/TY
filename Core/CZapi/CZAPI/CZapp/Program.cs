using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CZapp.C.Hik;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace CZapp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            new GetDataSet().InitParameters();

            Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Information()
         .WriteTo.Console()
        .MinimumLevel.Debug()
        .WriteTo.File(Path.Combine(DateTime.Now.ToString("yyyyMM") + "logs", $"log.txt"),
            rollingInterval: RollingInterval.Day,
            rollOnFileSizeLimit: true)
        .CreateLogger();

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>


        Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // <== compile failing here
            .AddJsonFile("appsettings.json");
                    IConfiguration configuration = builder.Build();
                    webBuilder.UseStartup<Startup>();
                   // webBuilder.UseUrls(configuration["host"]);
                });
    }
}
