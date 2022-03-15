using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PicTool
{
    public partial class Form1 : Form
    {

        private string DQurl;
        private string foldPath;
        private string imgPath;

        List<PointTLs> pointTLs = new List<PointTLs>();
        Dictionary<String, String> di = new Dictionary<String, string>();
        int k;
        double L, T;
        public Form1()
        {
            //  Dbhelper.DataSet("select * from dock_device");
            //foreach (Control c in mForm.Controls)
            //{
            //    controlRect objCtrl;
            //    objCtrl.Left = c.Left; objCtrl.Top = c.Top; objCtrl.Width = c.Width; objCtrl.Height = c.Height;
            //    oldCtrl.Add(objCtrl);
            //}
            InitializeComponent();

            pictureBox1.MouseWheel += new MouseEventHandler(pictureBox1_MouseWheel);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            imgPath = Menustrp();

            DQurl = imgPath + "\\室外\\室外.jpg";
            L = pictureBox1.Width; T = pictureBox1.Height;
            pictureBox1.BackgroundImage = Image.FromFile(DQurl);
            pictureBox1.BackgroundImageLayout = ImageLayout.Stretch;
            Dataset(DQurl);
            Pal(DQurl);
        }




        /// <summary>
        /// 滚轮缩放
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void pictureBox1_MouseWheel(object sender, MouseEventArgs e)
        {

            //if (e.Delta >= 0)
            //{
            //    pictureBox1.Width = (int)(pictureBox1.Width * 1.1);//因为Widthh和Height都是int类型，所以要强制转换一下-_-||
            //    pictureBox1.Height = (int)(pictureBox1.Height * 1.1);
            //}
            //else
            //{
            //    pictureBox1.Width = (int)(pictureBox1.Width * 0.9);
            //    pictureBox1.Height = (int)(pictureBox1.Height * 0.9);
            //}

        }

        /// <summary>
        /// menuStrip动态生成
        /// </summary>
        string Menustrp()
        {
            ToolStripMenuItem subItem;
            ToolStripMenuItem Grandson = new ToolStripMenuItem();
            ToolStripMenuItem subGrandson = new ToolStripMenuItem();
            //FolderBrowserDialog dialog = new FolderBrowserDialog();
            //if (dialog.ShowDialog() == DialogResult.OK)
            //{
            //    foldPath = dialog.SelectedPath;
            //}
            foldPath = AppDomain.CurrentDomain.BaseDirectory + "Img";
            List<string> list = new List<string>();

            Director(foldPath, list);

            subItem = AddContextMenu("地图", menuStrip1.Items, null);
            foreach (var item in list)
            {
                Grandson = AddContextMenu(item, subItem.DropDownItems, null);

                if (item != "室内")
                {
                    //第一种方法
                    DirectoryInfo folder = new DirectoryInfo($"{foldPath}\\{item}");
                    foreach (FileInfo file in folder.GetFiles("*.jpg"))
                    {
                        AddContextMenu(file.Name.Replace(".jpg", ""), Grandson.DropDownItems, new EventHandler(MenuClicked), file.FullName);
                    }
                }
                //添加子菜单 
                List<string> sublist = new List<string>();
                Director($"{foldPath}\\{item}", sublist);
                foreach (var subitme in sublist)
                {

                    subGrandson = AddContextMenu(subitme + "号楼", Grandson.DropDownItems, null);
                    List<string> subislist = new List<string>();
                    //string[] files = Directory.GetFiles($"{foldPath}\\{item}\\{subitme}", "*.jpg");
                    //foreach (var subisitem in files)
                    //{
                    //    subislist.Add(subisitem);
                    //   // AddContextMenu(subitme, subGrandson.DropDownItems, new EventHandler(MenuClicked));
                    //}
                    DirectoryInfo folder = new DirectoryInfo($"{foldPath}\\{item}\\{subitme}");
                    foreach (FileInfo file in folder.GetFiles("*.jpg"))
                    {
                        AddContextMenu(file.Name.Replace(".jpg", "") + "层", subGrandson.DropDownItems, new EventHandler(MenuClicked), file.FullName);
                    }

                }

            }
            return foldPath;
        }

        /// <summary>
        /// menuStrip1添加子结构
        /// </summary>
        /// <param name="text"></param>
        /// <param name="cms"></param>
        /// <param name="callback"></param>
        /// <returns></returns>
        ToolStripMenuItem AddContextMenu(string text, ToolStripItemCollection cms, EventHandler callback, string url = null)
        {
            if (text == "-")
            {
                ToolStripSeparator tsp = new ToolStripSeparator();
                cms.Add(tsp);
                return null;
            }
            else if (!string.IsNullOrEmpty(text))
            {
                ToolStripMenuItem tsmi = new ToolStripMenuItem(text);

                tsmi.Name = Guid.NewGuid().ToString();
                di.Add(tsmi.Name, url);
                tsmi.Tag = text + "TAG";
                if (callback != null) tsmi.Click += callback;
                cms.Add(tsmi);
                return tsmi;
            }

            return null;
        }

        Queue<Control> query = new Queue<Control>();
        /// <summary>
        /// menuStrip1点击事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void MenuClicked(object sender, EventArgs e)
        {
            //以下主要是动态生成事件并打开窗体

            ToolStripMenuItem but = sender as ToolStripMenuItem;

            foreach (var item in di.Keys)
            {
                if (item == but.Name)
                {
                    if (item != "")
                    {
                        DQurl = di[item];
                        IntiFisch();
                        label2.Text = DQurl.Substring(DQurl.LastIndexOf("Img"));


                    }
                }
            }


        }

        public void IntiFisch() {
            this.pictureBox1.BackgroundImage = Image.FromFile(DQurl);

            DS(pictureBox1);
            //删除遍历到的控件
            while (query.Count != 0)
            {
                query.Dequeue().Dispose();
            }

            Pal(DQurl);//根据坐标重新生成pick
        }


        void DS(Control item)
        {
            for (int i = 0; i < item.Controls.Count; i++)
            {
                if (item.Controls[i].HasChildren)
                {
                    DS(item.Controls[i]);
                }
                else
                {
                    query.Enqueue(item.Controls[i]);
                }
            }
        }

        /// <summary>
        /// 从数据库查询坐标
        /// </summary>
        void Pal(string url)
        {
            string urlis = url.Replace(foldPath, "");
            string sql = $"select a.\"P_Id\", a.\"point_X\",a.\"point_Y\" from device_point a,device_rule b where b.url='{urlis}' and a.role_id=b.role_id ";

            string ruolsql = $"  select a.\"P_Id\" ID, a.\"point_X\" 宽,a.\"point_Y\" 高,a.device_code 相机编码,a.role_id 关联ID from device_point a, device_rule b where b.role_id = a.role_id AND b.url = '{urlis}'";

            DataTable dt = Dbhelper.DataSet(sql);

            dataGridView1.DataSource = Dbhelper.DataSet(ruolsql);
            dataGridView1.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView1.RowHeadersVisible = false;
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow item in dt.Rows)
                {
                    PictureBox p = new PictureBox();
                    p.Name = "panelX" + k.ToString();
                    p.Click += P_Click;

                    //  MessageBox.Show(item["device_code"].ToString());
                    p.Size = new System.Drawing.Size(10, 10);
                    p.SizeMode = PictureBoxSizeMode.Zoom;
                    p.Tag = item["P_Id"].ToString();
                    p.Top = (int)(double.Parse(item["point_Y"].ToString()) * T); p.Left = (int)(double.Parse(item["point_X"].ToString()) * L);
                    //p.Anchor = AnchorStyles.Right;
                    p.Image = Image.FromFile(Application.StartupPath + "\\Img\\M.png");
                    pointTLs.Add(new PointTLs { left = (double)p.Left / L, height = (double)p.Top / T });

                    this.pictureBox1.Controls.Add(p);
                    k++;

                }

            }
        }

        /// <summary>
        /// 添加点击事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void P_Click(object sender, EventArgs e)
        {
            PictureBox pict = sender as PictureBox;

            string ss = pict.Tag.ToString();

            for (int i = 0; i < dataGridView1.Rows.Count; i++)
            {
                //找到相同的所在位置
                if (dataGridView1.Rows[i].Cells[0].Value.ToString().Trim() == ss)//我这里是
                {
                    dataGridView1.CurrentCell = dataGridView1.Rows[i].Cells[0];//设置datagridView1的活动单元格，要是你设置的他的选择方式为行的话就定位到哪一行了
                    break;
                }
            }
        }



        /// <summary>
        /// 遍历文件夹
        /// </summary>
        /// <param name="dir"></param>
        /// <param name="list"></param>
        public void Director(string dir, List<string> list)
        {
            try
            {
                DirectoryInfo theFolder = new DirectoryInfo(dir);
                DirectoryInfo[] dirInfo = theFolder.GetDirectories();
                //遍历文件夹
                foreach (DirectoryInfo NextFolder in dirInfo)
                {
                    list.Add(NextFolder.Name);
                }
            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.ToString());
            }


        }

        /// <summary>
        /// 鼠标点击标记
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void pictureBox1_MouseDown(object sender, MouseEventArgs e)
        {
            if (checkBox1.Checked != false)
            {
                //Graphics g = pictureBox1.CreateGraphics();
                //g.FillEllipse(Brushes.Red, e.X, e.Y, 10, 10);
                //// g.DrawEllipse(Pens.Red, e.X, e.Y, 10, 10);
                //g.Dispose();


                PictureBox p = new PictureBox();
                p.Name = "panelX" + k.ToString();
                //  p.BorderStyle = BorderStyle.Fixed3D;

                p.Size = new System.Drawing.Size(10, 10);
                p.SizeMode = PictureBoxSizeMode.Zoom;
                p.Top = e.Y; p.Left = e.X;
                //p.Anchor = AnchorStyles.Right;
                p.Image = Image.FromFile(Application.StartupPath + "\\Img\\M.png");
                pointTLs.Add(new PointTLs { left = (double)p.Left / L, height = (double)p.Top / T });
                this.pictureBox1.Controls.Add(p);
                string id = Guid.NewGuid().ToString("N");

                Insert(pointTLs[k].left, pointTLs[k].height, id);
                IntiFisch();
                Dataset(DQurl);
                //  Pal(DQurl);
                k++;
            }

        }

        /// <summary>
        /// 生成对应的坐标
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        void Insert(double x, double y, string id)
        {

            string uuid = Guid.NewGuid().ToString();
            string sql = $"insert into device_point(\"P_Id\",\"point_X\",\"point_Y\",\"device_code\",\"role_id\") values( '{id}','{x}','{y}',' ','{uuid}')";
            string url = DQurl.Replace(foldPath, "");
            string rlsql = $"insert into device_rule(\"role_id\",\"url\") values('{uuid}','{url}')";

            if (Dbhelper.ExecuteNonQuery(sql) > 0)
            {
                Dbhelper.ExecuteNonQuery(rlsql);
            }
            string sqlset = "select * from device_point";
            dataGridView1.DataSource = Dbhelper.DataSet(sqlset);
            dataGridView1.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView1.RowHeadersVisible = false;
            // Dataset();
        }

        /// <summary>
        /// 重新加载数据
        /// </summary>
        void Dataset(string url)
        {
            string urlis = url.Replace(foldPath, "");
            string sql = "SELECT device_code 相机编码,device_name 点位名称,\"state\" 启用状态 FROM device_map";
            dataGridView2.DataSource = Dbhelper.DataSet(sql);
            dataGridView2.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView2.RowHeadersVisible = false;//禁止编辑
            string sqlset = $" select a.\"P_Id\" ID, a.\"point_X\" 宽, a.\"point_Y\" 高, a.device_code 相机编码, a.role_id 关联ID from device_point a, device_rule b where b.role_id = a.role_id AND b.url = '{urlis}'";
            dataGridView1.DataSource = Dbhelper.DataSet(sqlset);
            dataGridView1.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView1.RowHeadersVisible = false;

            //  dataGridView1.AutoGenerateColumns = true;
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void button1_Click(object sender, EventArgs e)
        {
            string code = "";
            string sqlset = $"select * from device_map where state='0'";
            if (textBox1.Text != "")
            {
                sqlset = $"select * from device_map where device_name like '%" + textBox1.Text + "%' and state='0'";
            }


            dataGridView2.DataSource = Dbhelper.DataSet(sqlset);
            dataGridView2.SelectionMode = DataGridViewSelectionMode.FullRowSelect;


            dataGridView2.RowHeadersVisible = false;
        }

        /// <summary>
        /// 引入
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void button3_Click(object sender, EventArgs e)
        {
            string id = dataGridView1.SelectedRows[0].Cells[0].Value.ToString();

            string code = dataGridView2.SelectedRows[0].Cells[0].Value.ToString();

            int i = dataGridView1.CurrentRow.Index;
            string sql = $"update device_point set device_code='{code}' where \"P_Id\"='{id}'";
            string delDev = $"update  device_map set state='1' where \"device_code\"='{code}'";
            if (Dbhelper.ExecuteNonQuery(sql) > 0)
            {
                Dbhelper.ExecuteNonQuery(delDev);
                Dataset(DQurl);
                // Pal(DQurl);
            }
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void button2_Click(object sender, EventArgs e)
        {
            string code = dataGridView1.SelectedRows[0].Cells[3].Value.ToString();
            string role_id = dataGridView1.SelectedRows[0].Cells[4].Value.ToString();
            string id = dataGridView1.SelectedRows[0].Cells[0].Value.ToString();

            string sql = $"delete from device_point  where device_point.\"P_Id\"='{id}'";


            string sqlrl = $"delete from device_rule  where role_id='{role_id}'";

            if (code != " " && code != null)
            {
                string msql = $"update  device_map set state='0' where \"device_code\"='{code}'";
                Dbhelper.ExecuteNonQuery(msql);
            }

            if (Dbhelper.ExecuteNonQuery(sql) > 0)
            {

                Dbhelper.ExecuteNonQuery(sqlrl);
                Dataset(DQurl);
                IntiFisch();
                this.Invoke(new Action(() =>
                {
                    Application.DoEvents();
                   // Pal(DQurl);
                }));

                MessageBox.Show("删除成功");
            }
        }

        /// <summary>
        /// 选中行事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void dataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {

            //MessageBox.Show(dataGridView1.SelectedRows[0].Cells[0].Value.ToString());
            //double selectRowLeft = double.Parse(dataGridView1.SelectedRows[0].Cells[1].Value.ToString());
            //double selectRowTop = double.Parse(dataGridView1.SelectedRows[0].Cells[2].Value.ToString());

            //PictureBox p = new PictureBox();

            //p.Size = new System.Drawing.Size(15, 15);
            //p.SizeMode = PictureBoxSizeMode.Zoom;
            //p.Top = (int)(selectRowTop * T); p.Left = (int)(selectRowLeft * L);
            //p.Anchor = AnchorStyles.Right;
            //draw(p.Top, p.Left);

            //p.BackColor = Color.Red;

            //p.Anchor = AnchorStyles.Right;
            //p.Image = Image.FromFile(Application.StartupPath + "\\Img\\M.png");
            //pointTLs.Add(new PointTLs { left = (double)p.Left / L, height = (double)p.Top / T });
            //this.pictureBox1.Controls.Add(p);


        }

        private void draw(int top, int left)
        {
            PictureBox pb1 = new PictureBox();
            Bitmap b = new Bitmap(600, 600);//位图
            pb1.Dock = System.Windows.Forms.DockStyle.Fill;
            Graphics g = Graphics.FromImage(b);//画布
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            Pen p = new Pen(Color.Red, 3);//画笔

            //g.DrawPie(p, new Rectangle(new Point(300, 300), new Size(100, 100)), 0, 360);//画圆
            g.DrawEllipse(p, left, top, 20, 20);
            pb1.Image = b;
            pictureBox1.Controls.Add(pb1);
        }


        /// <summary>
        /// 控件自适应
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void pictureBox1_Resize(object sender, EventArgs e)
        {
            //int picturecount = 0;
            //int l = pictureBox1.Width, t = pictureBox1.Height;
            //foreach (var item in pictureBox1.Controls)
            //{
            //    if (item is PictureBox)
            //    {
            //        PictureBox BUTx = ((PictureBox)item);
            //        double s = pointTLs[picturecount].left * l;
            //        double d = pointTLs[picturecount].height * t;
            //        BUTx.Left = (int)s;
            //        BUTx.Top = (int)d;
            //        picturecount++;
            //    }
            //}



        }




    }
}
