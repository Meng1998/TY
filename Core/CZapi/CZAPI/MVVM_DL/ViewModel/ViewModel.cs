using MVVM_DL.Commands;
using MVVM_DL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVVM_DL.ViewModel
{
    class ViewModelUser
    {
        private IList<User> _userList;


        public IList<User> Users
        {
            get => _userList;
            set
            {
                if (_userList != value)
                    _userList = value;
            }
        }

        public string Name { get; set; }
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }


        private LoginCommand _loginCommand;
        public LoginCommand LoginCommand
        {
            get { return _loginCommand; }
        }
        private RegisterNewUserCommand _register;
        public RegisterNewUserCommand RegisterCommand
        {
            get { return _register; }
        }
        public ViewModelUser()
        {
            _userList = new List<User> { new User("xiaozhao", "123"), new User("xiaowang", "124") };
            _loginCommand = new LoginCommand(this);
            _register = new RegisterNewUserCommand(this);
        }



    }

}
