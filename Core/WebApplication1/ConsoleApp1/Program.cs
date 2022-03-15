using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        //导入对象使用
        [Import("chinese_hello")]
        public Person oPerson { set; get; }

        //导入对象使用
        [Import("american_hello")]
        public Person aPerson { set; get; }

        static void Main(string[] args)
        {
            var oProgram = new Program();
            oProgram.MyComposePart();
            var strRes = oProgram.oPerson.SayHello("李磊");
            Console.WriteLine(strRes);
            var strRe = oProgram.aPerson.SayHello("李磊");
            Console.WriteLine(strRe);

            Console.Read();
        }

        //宿主MEF并组合部件
        void MyComposePart()
        {
            //获取当前执行的程序集中所有的标有特性标签的代码段
            var catalog = new AssemblyCatalog(Assembly.GetExecutingAssembly());

            //将所有Export特性标签存放进组件容器中（其实是一个数组里面）
            var container = new CompositionContainer(catalog);

            

            //将部件（part）和宿主程序添加到组合容器
            container.ComposeParts(this);
        }
    }

    public interface Person
    {
        string SayHello(string name);
    }

    //声明对象可以导出
    [Export("chinese_hello", typeof(Person))]
    public class Chinese : Person
    {
        public string SayHello(string name)
        {
            return "你好：" + name;
        }
    }

    [Export("american_hello", typeof(Person))]
    public class American : Person
    {
        public string SayHello(string name)
        {
            return "Hello:" + name;
        }
    }
}
