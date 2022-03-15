using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CZapp.Drt;
using MathNet.Spatial.Euclidean;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NetTopologySuite.Geometries;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace CZapp.Controllers
{
    [ApiController]
    [Route("WeatherForecast")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Route("GetMer")]
        [HttpGet]
        public JObject GetMer()
        {
            //LineSegment lineSeg1 = new LineSegment(1, 1, 0, 3);
            //LineSegment lineSeg2 = new LineSegment(3, 1, 5, 2);
            //GeoAPI.Geometries.Coordinate cor = lineSeg1.Intersection(lineSeg2); // 线段的交点
            //cor = lineSeg1.LineIntersection(lineSeg2);

            Line2D Line1 = new Line2D(new Point2D(0, 0), new Point2D(2, 2));
            Line2D Line2 = new Line2D(new Point2D(1, -9), new Point2D(4, 0));
            Point2D? r = Line1.IntersecWithSegmentLine(Line2);



            return JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(new { code = "200", data = "HH" }));
        }


    }
}
