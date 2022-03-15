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
using System.Windows.Shapes;

namespace MVVM_DL
{
    /// <summary>
    /// XX.xaml 的交互逻辑
    /// </summary>
    public partial class XX : Window
    {
        public static XX main;
        public XX()
        {
            InitializeComponent();
            main = this;
            DataContext = this;

            //this.AllowsTransparency = true;//窗体支持透明度
            //this.Opacity = 0.6;//设置透明度为0.4
        }

        #region grid布局传参

        public GridLength OneRowgrid
        {
            get { return (GridLength)GetValue(OneRowgridProperty); }
            set { SetValue(OneRowgridProperty, value); }
        }
        public static readonly DependencyProperty OneRowgridProperty =
            DependencyProperty.Register("OneRowgrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        public GridLength TwoRowgrid
        {
            get { return (GridLength)GetValue(TwoRowgridProperty); }
            set { SetValue(TwoRowgridProperty, value); }
        }
        public static readonly DependencyProperty TwoRowgridProperty =
            DependencyProperty.Register("TwoRowgrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        public GridLength ThreeRowgrid
        {
            get { return (GridLength)GetValue(ThreeRowgridProperty); }
            set { SetValue(ThreeRowgridProperty, value); }
        }
        public static readonly DependencyProperty ThreeRowgridProperty =
            DependencyProperty.Register("ThreeRowgrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        public GridLength OneColumngrid
        {
            get { return (GridLength)GetValue(OneColumngridProperty); }
            set { SetValue(OneColumngridProperty, value); }
        }
        public static readonly DependencyProperty OneColumngridProperty =
            DependencyProperty.Register("OneColumngrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        public GridLength TwoColumngrid
        {
            get { return (GridLength)GetValue(TwoColumngridProperty); }
            set { SetValue(TwoColumngridProperty, value); }
        }
        public static readonly DependencyProperty TwoColumngridProperty =
           DependencyProperty.Register("TwoColumngrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));
        public GridLength ThreeColumngrid
        {
            get { return (GridLength)GetValue(ThreeColumngridProperty); }
            set { SetValue(ThreeColumngridProperty, value); }
        }
        public static readonly DependencyProperty ThreeColumngridProperty =
           DependencyProperty.Register("ThreeColumngrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        #endregion




        Boolean Rd = true;
        private void Button_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (Rd)
            {
                TwoColumngrid = new GridLength(1, GridUnitType.Star);
                TwoRowgrid = new GridLength(1, GridUnitType.Star);
                Rd = !Rd;
            }
            else
            {
                TwoColumngrid = new GridLength(0, GridUnitType.Star);
                TwoRowgrid = new GridLength(0, GridUnitType.Star);
                Rd = !Rd;
            }
        }


        //拖动
        private void CustomWindow_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            //Window win = (Window)((FrameworkElement)sender).TemplatedParent;
            //if (e.LeftButton == MouseButtonState.Pressed)
            //{
            //    win.DragMove();
            //}
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                base.OnMouseLeftButtonDown(e);

                // Begin dragging the window

                this.DragMove();
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
    }
}
