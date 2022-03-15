using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTool
{
    public class Dbhelper
    {

        private static string npgsql = $"Server=localhost;Port=5432;UserId=postgres;Password=tyaimap;Database=noone;";
        //private static string npgsql = $"Server=172.18.18.14;Port=5432;UserId=postgres;Password=tyaimap;Database=aimap;";
        private static NpgsqlConnection sqlcon = new NpgsqlConnection(npgsql);
        private static string strsql = $"server=172.18.18.22;database='PT_DM';uid=sa;pwd=QHNZJDS@2019;";
        private static SqlConnection sqlconnet = new SqlConnection(strsql);


        public static DataTable SQLDdataSet(string sql) {
            SqlCommand sqlcmd = new SqlCommand(sql, sqlconnet);
            SqlDataAdapter adapter = new SqlDataAdapter(sqlcmd);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            return dt;
        }

       
        public static DataTable DataSet(string sqlstr)
        {
            NpgsqlCommand cmd = new NpgsqlCommand(sqlstr, sqlcon);
            NpgsqlDataAdapter NpgDa = new NpgsqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            NpgDa.Fill(dt);
            return dt;
        }
        public static  int ExecuteNonQuery(string sqlstr)
        {
            sqlcon.Open();
            NpgsqlCommand SqlCommand = new NpgsqlCommand(sqlstr, sqlcon);
            int r = SqlCommand.ExecuteNonQuery();  //执行查询并返回受影响的行数
            sqlcon.Close();
            return r; //r如果是>0操作成功！ 

        }
    }
}
