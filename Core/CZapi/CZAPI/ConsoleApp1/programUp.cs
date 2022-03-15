using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class programUp
    {

        public void Initinfo() { 
            
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
                //var suffixName = suffix == "png"
                //    ?  ImageFormat.Png
                //    : suffix == "jpg" || suffix == "jpeg"
                //        ? ImageFormat.Jpeg
                //        : suffix == "bmp"
                //            ? ImageFormat.Bmp
                //            : suffix == "gif"
                //                ? ImageFormat.Gif
                //                : ImageFormat.Jpeg;
                ImageFormat suffname =null;
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
                    suffname=ImageFormat.Jpeg;
                    base64 = " data:image/jpeg;base64,";
                }

                bmp.Save(ms, suffname);
                byte[] arr = new byte[ms.Length]; ms.Position = 0;
                ms.Read(arr, 0, (int)ms.Length); ms.Close();
                String str= base64 + Convert.ToBase64String(arr);
                return str;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
    }
}
