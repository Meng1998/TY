using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace CZapp.model
{
    class Hik
    {
    }

    public class ExpResult
    {
        public String dirId { get; set; } 

       
        public string list { get; set; }
    }

    public class Captureface
    {
        public String startTime { set; get; }
        public String endTime { set; get; }
        public String facePicUrl { set; get; } = "";
        public String facePicBinaryData { set; get; } = "";
        public Int32 minSimilarity { set; get; }
    }

    public class result
    {
        public String Code { set; get; }
        public DataTable Data { set; get; }
    }


    public class Infolist
    {
        public Int32 urlindex { get; set; }
        public JObject data { get; set; }
    }
    public class addlist
    {
        public String urlindex { get; set; }
        public JObject data { get; set; }
    }
}
