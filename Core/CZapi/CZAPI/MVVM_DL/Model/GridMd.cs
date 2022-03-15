using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace MVVM_DL.Model
{
    class GridMd: DependencyObject
    {
        public GridLength OneRowgrid
        {
            get { return (GridLength)GetValue(OneRowgridProperty); }
            set { SetValue(OneRowgridProperty, value); }
        }
        public static readonly DependencyProperty OneRowgridProperty =
            DependencyProperty.Register("OneRowgrid", typeof(GridLength), typeof(MainWindow), new PropertyMetadata(new GridLength(1, GridUnitType.Star)));


    }
}
