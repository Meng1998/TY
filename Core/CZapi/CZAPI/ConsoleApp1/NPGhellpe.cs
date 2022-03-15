using Npgsql;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    static class NPGhellpe
    {
        private static String strconn = "";

        public static string connStr = ConfigurationSettings.AppSettings["NpgConn"].ToString();
        public static DataSet dataSet()
        {
            return null;
        }

        public static List<T> DatamanagerRegistre<T>(this string sql, ref List<T> data, params NpgsqlParameter[] parameters) where T : new()
        {

            using (NpgsqlConnection conn = new NpgsqlConnection(connStr))
            {
               
                try
                {
                    conn.Open();
                }
                catch (Exception)
                {
                    return null;
                }
                using (NpgsqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = sql;
                    if (parameters != null)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }

                    NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(cmd);
                    DataSet dataset = new DataSet();
                    adapter.Fill(dataset);

                    foreach (DataRow item in dataset.Tables[0].Rows)
                    {
                        int k = 0;
                        T t = new T();
                        Type tf = t.GetType();
                        PropertyInfo[] pinfo = tf.GetProperties();//获取属性
                        foreach (PropertyInfo p in pinfo)
                        {
                            switch (p.PropertyType.ToString())
                            {
                                case "System.String":
                                    p.SetValue(t, item.ItemArray[k].ToString(), null);
                                    break;
                                case "System.Boolean":
                                    p.SetValue(t, Boolean.Parse(item.ItemArray[k].ToString()), null);
                                    break;
                                case "System.Decimal":
                                    p.SetValue(t, Decimal.Parse(item.ItemArray[k].ToString()), null);
                                    break;
                                case "System.Int32":
                                    p.SetValue(t, Int32.Parse(item.ItemArray[k].ToString()), null);
                                    break;
                                case "System.Nullable`1[System.DateTime]":
                                    p.SetValue(t, (DateTime?)DateTime.ParseExact(item.ItemArray[k].ToString(), "yyyy-MM-dd HH:mm:ss", null), null);
                                    break;
                                default:
                                    break;
                            }
                            //fieldValue += "'" + p.GetValue(field).ToString() + "'" + ",";
                            k++;
                        }

                        data.Add(t);

                    }
                }
            }
            return data;


        }

        

        public static int managerRegister<T>(T field)
        {
            string fieldName = "";
            string fieldList = "";
            string fieldValue = "";
            int k = 0;
            Type tf = typeof(T);
            fieldName = tf.Name;//获取类型名称
            PropertyInfo[] pinfo = tf.GetProperties();//获取属性
            string[] paraList = new string[pinfo.Length];//参数化查询字段的数组
            //List<SqlParameter> para = new List<SqlParameter>();//用于放置参数化查询
            foreach (PropertyInfo p in pinfo)
            {
                fieldList += p.Name + ",";
                fieldValue += "'" + p.GetValue(field).ToString() + "'" + ",";
                paraList[k] = p.Name;
                //para.Add(new SqlParameter("@" + paraList[k], fieldValue));
                k = k + 1;//当循环执行时k加一使得数组能够连续获取到字段
            }
            fieldList = fieldList.Substring(0, fieldList.Length - 1);//去除最后一个逗号
            fieldValue = fieldValue.Substring(0, fieldValue.Length - 1);
            // sqlselect = string.Format(sqlselect, fieldName, fieldList, fieldValue);
            // int value = DBhelper.ExcuteQuery(sqlselect, para.ToArray());//调用自己写的一个数据库插入语句并返回一个值
            return 0;//返回插入语句的情况
        }
    }

    public class cus_info
    {
        public String id { get; set; }
        public String custom_name { get; set; }
        public String custom_address { get; set; }
        public String province { get; set; }
        public String province_name { get; set; }
        public String city { get; set; }
        public String city_name { get; set; }
        public String county { get; set; }
        public String county_name { get; set; }
        public String remark { get; set; }
    }

    public class device_category
    {
        public String id { get; set; }
        public String category_name { get; set; }
        public String category_icon { get; set; }
        public String category_intent { get; set; }
        public Boolean enable { get; set; }
        public String remark { get; set; }
        public Int32 order { get; set; }
    }
}
