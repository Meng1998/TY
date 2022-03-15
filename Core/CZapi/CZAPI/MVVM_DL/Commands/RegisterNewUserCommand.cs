using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using MVVM_DL.Model;
using MVVM_DL.ViewModel;

namespace MVVM_DL.Commands
{
    class RegisterNewUserCommand : ICommand
    {


        private ViewModelUser _vm;

        public RegisterNewUserCommand(ViewModelUser viewmodel)
        {
            _vm = viewmodel;

        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
        public bool CanExecute(object parameter)
        {
            var judge = _vm.Users.Any((a) => a.UserName == _vm.Name);
            if (!judge) return true;  //  重复用户不添加
            else return false;

        }

        public void Execute(object parameter)
        {
            if (_vm.Password == _vm.ConfirmPassword)
            {
                _vm.Users.Add(new User(_vm.Name, _vm.Password));
                MessageBox.Show("新用户注册成功");
            }
            else
            {
                MessageBox.Show("两次输入密码不一致");
            }
        }
    }

    class LoginCommand : ICommand
    {
        private ViewModelUser _vm;

        public LoginCommand(ViewModelUser viewmodel)
        {
            _vm = viewmodel;

        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
        public bool CanExecute(object parameter)
        {
            if (_vm.Name != null && _vm.Name != "") return true;
            else return false;
        }

        public void Execute(object parameter)
        {

            var judge = _vm.Users.Any((a) => a.UserName == _vm.Name && a.Password == _vm.Password);
            if (judge)
                MessageBox.Show("登录成功");
            else
                MessageBox.Show("密码错误，请重试");

        }
    }

}
