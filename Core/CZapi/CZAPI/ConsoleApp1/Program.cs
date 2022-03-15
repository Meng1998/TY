using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {

           //String base64=  programUp.ImageToBase64(@"C:\Users\15907\Desktop\xx\123.jpg");

            List<device_category> data = new List<device_category>();
            String sql = "select * from \"device_category\"";
            sql.DatamanagerRegistre(ref data, null);
            //NPGhellpe.DatamanagerRegistre<device_category>( , ref data, null);
            Console.ReadKey();
        }
    }
}
