using MahApps.Metro.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
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
    /// YY.xaml 的交互逻辑
    /// </summary>
    public partial class YY : Window
    {
        public YY()
        {
            InitializeComponent();

            DataContext = this;
        }

        public GridLength OneWidth
        {
            get { return (GridLength)GetValue(NameWidthProperty); }
            set { SetValue(NameWidthProperty, value); }
        }
        public static readonly DependencyProperty NameWidthProperty =
            DependencyProperty.Register("OneWidth", typeof(GridLength), typeof(YY), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        public GridLength TwoWidth
        {
            get { return (GridLength)GetValue(TwoWidthProperty); }
            set { SetValue(TwoWidthProperty, value); }
        }
        public static readonly DependencyProperty TwoWidthProperty =
            DependencyProperty.Register("TwoWidth", typeof(GridLength), typeof(YY), new PropertyMetadata(new GridLength(0, GridUnitType.Star)));

        public GridLength OneHeight
        {
            get { return (GridLength)GetValue(OneHeightProperty); }
            set { SetValue(OneHeightProperty, value); }
        }
        public static readonly DependencyProperty OneHeightProperty =
            DependencyProperty.Register("OneHeight", typeof(GridLength), typeof(YY), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));

        public GridLength TwoHeight
        {
            get { return (GridLength)GetValue(TwoHeightProperty); }
            set { SetValue(TwoHeightProperty, value); }
        }
        public static readonly DependencyProperty TwoHeightProperty =
           DependencyProperty.Register("TwoHeight", typeof(GridLength), typeof(YY), new PropertyMetadata(new GridLength(0, GridUnitType.Star)));

        Boolean Rd = true;
        private void Button_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            
            //if (Rd)
            //{
            //    TwoColumngrid = new GridLength(1, GridUnitType.Star);
            //    TwoRowgrid = new GridLength(1, GridUnitType.Star);
            //    Rd = !Rd;
            //}
            //else
            //{
            //    TwoColumngrid = new GridLength(0, GridUnitType.Star);
            //    TwoRowgrid = new GridLength(0, GridUnitType.Star);
            //    Rd = !Rd;
            //}
        }
    }
}
