using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CZapp.Drt
{
    public class Directoryfile
    {
        Dictionary<String, String> dicKV = new Dictionary<String, String>();
        static String sql = "";

        public Int32 Filepath(String path,String handpath)
        {
            var builder = new ConfigurationBuilder()
             .SetBasePath(Directory.GetCurrentDirectory()) // <== compile failing here
             .AddJsonFile("appsettings.json");
            IConfiguration configuration = builder.Build();
            DirectoryInfo root = new DirectoryInfo(path);
            FileInfo[] dics = root.GetFiles();//文件 DirectoryInfo//文件夹
            Int32 index = 0,ki=0;
            foreach (FileInfo item in dics)
            {

                sql += $"INSERT INTO \"public\".\"map_deviceurl\" values('{Guid.NewGuid().ToString()}','{item.Name.Split('.')[0]}','{configuration["ImgurlHoust"]}/{handpath}/{item.Name}');";
                //if (ki<10)
                //{
                //    sql += $"INSERT INTO \"public\".\"map_deviceurl\" values('{Guid.NewGuid().ToString()}','{item.Name.Split('.')[0]}','{configuration["ImgurlHoust"]}//{handpath}//Img');";
                //   // sql += $"INSERT INTO \"public\".\"map_deviceurl\" values('{Guid.NewGuid().ToString()}','{item.Name.Split('.')[0]}','{ImageToBase64(item.FullName)}');";
                //    ki++;
                //}
                //else
                //{
                //    index+= new Pgsql().ExecuteSQL(sql);
                //    sql = "";
                //    ki = 0;
                //}
                // dicKV.Add(item.Name.Split('.')[0], ImageToBase64(item.FullName));
            }
            index=new Pgsql().ExecuteSQL(sql);
            return index;
            //Task<Boolean> t = strbasesql(dics);
            //Boolean bl = false;
            //Task.Run(async () =>
            //{
            //    bl = await t;
            //    return new Pgsql().ExecuteSQL(sql);
            //});
            //while (!bl)
            //{

            //}
            //return -1;
        }
        public static async Task<Boolean> strbasesql(FileInfo[] fileInfos)
        {
            return await Task.Run(() =>
            {
                try
                {
                    foreach (FileInfo item in fileInfos)
                    {
                        sql += $"INSERT INTO \"public\".\"map_deviceurl\" values('{Guid.NewGuid().ToString()}','{item.Name.Split('.')[0]}','{ImageToBase64(item.FullName)}');";
                        // dicKV.Add(item.Name.Split('.')[0], ImageToBase64(item.FullName));
                    }
                    return true;
                }
                catch (Exception)
                {
                    return false; 
                }
            });
        }


        /// <summary>
        /// Image 转成 base64
        /// </summary>
        /// <param name="fileFullName"></param>
        public static string ImageToBase64(string fileFullName)
        {
            try
            {
                Bitmap bmp = new Bitmap(fileFullName);
                MemoryStream ms = new MemoryStream();
                var suffix = fileFullName.Substring(fileFullName.LastIndexOf('.') + 1,
                    fileFullName.Length - fileFullName.LastIndexOf('.') - 1).ToLower();

                ImageFormat suffname = null;
                String base64 = "";
                if (suffix == "png")
                {
                    suffname = ImageFormat.Png;
                    base64 = " data:image/png;base64,";
                }
                else if (suffix == "jpg" || suffix == "jpeg")
                {
                    suffname = ImageFormat.Jpeg;
                    base64 = " data:image/jpg;base64,";
                }
                else if (suffix == "bmp")
                {
                    suffname = ImageFormat.Bmp;
                    base64 = " data:image/bmp;base64,";
                }
                else if (suffix == "gif")
                {
                    suffname = ImageFormat.Gif;
                    base64 = " data:image/gif;base64,";
                }
                else
                {
                    suffname = ImageFormat.Jpeg;
                    base64 = " data:image/jpeg;base64,";
                }

                bmp.Save(ms, suffname);
                byte[] arr = new byte[ms.Length]; ms.Position = 0;
                ms.Read(arr, 0, (int)ms.Length); ms.Close();
                String str = base64 + Convert.ToBase64String(arr);
                return str;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
    }
}
