using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CZapp.Drt
{
    public class Pgsql
    {
        private String ConnStr;
        private NpgsqlConnection SqlConn;
        public Pgsql()
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory()) // <== compile failing here
               .AddJsonFile("appsettings.json");
            IConfiguration configuration = builder.Build();
            ConnStr = configuration["pgSql"];
            SqlConn = new NpgsqlConnection(ConnStr);
        }
        public DataSet PgExecute(String sqlstr)
        {
            DataSet ds = new DataSet();
            try
            {
                using (NpgsqlDataAdapter sqldap = new NpgsqlDataAdapter(sqlstr, SqlConn))
                {
                    sqldap.Fill(ds);
                }
                return ds;
            }
            catch (System.Exception ex)
            {
                SqlConn.Close();
                return ds;
            }
        }


        /// <summary>
        /// 增 删 改（无参数）
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public int ExecuteSQL(string sql)
        {
            int n = -1;

            using (NpgsqlCommand cmd = new NpgsqlCommand(sql, SqlConn))
            {
                try
                {
                    SqlConn.Open();
                    n = cmd.ExecuteNonQuery();
                }
                catch (NpgsqlException exception)
                {
                    throw new Exception(exception.Message);
                }
                finally
                {
                    SqlConn.Close();
                }
            }
            return n;

        }



    }
}
