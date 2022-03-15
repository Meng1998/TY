using MVVM_DL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MVVM_DL.Style
{
    ///<summary>
    ///Page2.xaml 的交互逻辑
    ///</summary>
    public partial class Page2 
    {
        public Page2()
        {
            InitializeComponent();

          //  GridMd grid = new GridMd();
        }
        #region grid
     
        #endregion

        //拖动
        private void CustomWindow_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Window win = (Window)((FrameworkElement)sender).TemplatedParent;
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                win.DragMove();
            }
        }

        // 关闭
        private void CustomWindowBtnClose_Click(object sender, RoutedEventArgs e)
        {
            Window win = (Window)((FrameworkElement)sender).TemplatedParent;
            win.Close();
        }

        // 最小化
        private void CustomWindowBtnMinimized_Click(object sender, RoutedEventArgs e)
        {
            Window win = (Window)((FrameworkElement)sender).TemplatedParent;
            win.WindowState = WindowState.Minimized;
        }

        // 最大化、还原
        private void CustomWindowBtnMaxNormal_Click(object sender, RoutedEventArgs e)
        {
            Window win = (Window)((FrameworkElement)sender).TemplatedParent;
            Rect rc = SystemParameters.WorkArea;
            if (win.WindowState == WindowState.Maximized)
            {
                win.WindowState = WindowState.Normal;
            }
            else
            {
                // 不覆盖任务栏
                //win.MaxWidth = SystemParameters.WorkArea.Width;
                //win.MaxHeight = SystemParameters.WorkArea.Height;
              
                win.WindowState = WindowState.Maximized;
            }

        }


        private void Button_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            //XX.main.Dispatcher.Invoke(new Action(() =>
            //{
            //    new XX().OneRowgrid = new GridLength(0, GridUnitType.Star);
            //}));

          


        }
    }
}




