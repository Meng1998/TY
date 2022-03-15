using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVVM_DL.Model
{
    class User : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        private void OnPropertyChanged(string property)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(property));
        }

        private string _userName;
        private string _psword;

        public string UserName
        {
            get => _userName;
            set
            {
                if (_userName != value)
                {
                    _userName = value;
                    OnPropertyChanged("UserName");
                }
            }
        }

        public string Password
        {
            get => _psword;
            set
            {
                if (_psword != value)
                {
                    _psword = value;
                    OnPropertyChanged("Password");
                }
            }
        }

        public User(string name, string psword)
        {
            this.UserName = name;
            this.Password = psword;
        }


    }

}
