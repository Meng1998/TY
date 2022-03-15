import React, { Component } from 'react'
import {getSorting} from '../../api/mainApi';
// 引入 ECharts 主模块
import * as echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
//插件
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/dataset';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import './style.scss'



export default class SmartSorting extends Component {
    constructor(props){
        super(props)
        this.state={
            widthjd:[342,342,342],
            ratedata:[],
            TrueData:[],
            fjsl:[],
            // 当日分拣情况
            fjsl1:[],
            fjsl2:[],
            // 当日入库
            dayKu:[],
            jyzs:[],//卷烟总数
            khzs:[],//客户总数
            jindu_hh:[],//进度,
            yearfj:[],
            yearfj2:[]
        }
    }
    // 初始化加载 echarts 表格,以及接口数据  
    componentDidMount(){
        this.LoadDta()
        setTimeout(()=>{
            //柱状图
            const listpie = echarts.init(document.getElementById("Sortingline-listpie"));
            listpie.setOption(this.SzlineEcharts());
            //饼状图
            this.getBing("xiaolv")
            this.getYear()

        },100)
     

        // 加载下方法
    //   this.zhfj()
    }
    
    // 改变表格的大小
    SzlineEcharts() {
        var datacity = ['科盛异形烟线1', '科盛异形烟线2', '兰剑分拣线1', '兰剑分拣线2', '中溢手工线'];
        return {
            color: ['rgb(92,192,234)','rgba(92,192,234,0.4)','rgb(82,132,219)', 'rgba(82,132,219)'],
            tooltip: {
                trigger: 'axis',
            },
            legend: {
        
                top: '8%',
                data: ['卷烟总数','客户总数'],
                textStyle: {
                    color: 'white'
                },
            },
            grid: { //图表的位置
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} ',
                    textStyle: {
                        fontSize: 10,
                        color: 'white'
                    },
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                show: true
        
                }],
                xAxis: [{
                    type: 'category',
                    axisLabel: {
                        interval: 0,
                        show: true,
                        splitNumber: 15,
                        textStyle: {
                            fontSize: 10,
                            color: 'white'
                        },
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    data: datacity,
                }],
                series: [
                {
                    name: '卷烟总数',
                    type: 'bar',
                    barWidth: '20px',
                    stack: 'sum',
                    data:this.state.jyzs
                },
                {
                    name: '客户总数',
                    type: 'bar',
                    color: 'rgba(82,132,219,0.4)',
                    stack: 'sum1',
                    barWidth: '20px',
                    data:this.state.khzs
                },
            ]
        };
    }

    LoadDta(){
        getSorting().then(data=>{
            
            var commoatin=data.largeScreenModules[5].largeScreenModuleDetailes
            var spliceData=data.largeScreenModules[0].largeScreenModuleDetailes.slice(0,9)
            //var spliceData111=data.largeScreenModules[0].largeScreenModuleDetailes
            
           var spliceData1=data.largeScreenModules[0].largeScreenModuleDetailes.slice(9,15)
         
       
           var title=[]
        // 我带外面吃
           for(let i=0;i<spliceData1.length;){
                if(i%2===0){
                    console.log(i,111)
                    title.push(spliceData1[i].keyDesc)
                }
               i++
           }

           // 这种方法，数据不好处理，等我换一种


        //    title.forEach(element=>{

        //    })
         
      
        // 当日入库
           var drrk=data.largeScreenModules[5].largeScreenModuleDetailes
           var aaa=[]
           drrk.forEach((element,index)=>{
               if(index===0){
                    aaa.push({
                        keyDesc:element.keyDesc,
                        value:element.value,
                        img:require("../../assets/images/right/quyu-icon.png").default
                    })
               }else if((index===1)){
                    aaa.push({
                        keyDesc:element.keyDesc,
                        value:element.value,
                        img:require("../../assets/images/right/kehu-icon.png").default
                    })
               }else{
                    aaa.push({
                        keyDesc:element.keyDesc,
                        value:element.value,
                        img:require("../../assets/images/right/xianlu-icon.png").default
                    })
               }
              
           })
           //仓储概况
           

           // 分拣线
           var fjx=data.largeScreenModules
           console.log("分拣线的距离覅看 ",fjx)
           var jysl = [];
           var khsl = [];
           var xiaolv = [];
           var jindu = []
          fjx.forEach((element)=>{
                if(element.moduleDesc === "科盛异形烟线" || element.moduleDesc === "科盛异形烟线1" || element.moduleDesc === "兰剑分拣线" || element.moduleDesc === "兰剑分拣线1" || element.moduleDesc === "中溢手工线"){
                    element.largeScreenModuleDetailes.forEach(element2 => {
                        if(element2.keyDesc === "卷烟数量"){
                            jysl.push(parseInt(element2.value))
                        }else if(element2.keyDesc === "客户数量"){
                            khsl.push(parseInt(element2.value))
                        }else if(element2.keyDesc === "分拣效率"){
                            xiaolv.push({
                                name:element.moduleDesc,
                                value:parseInt(element2.value)
                            })
                        }else if(element2.keyDesc === "进度" && element2.key === "quantityRate"){
                            jindu.push({
                                name:element.moduleDesc,
                                value:parseInt(element2.value)
                            })
                        }
                        // ratedata
                    });
                }
            })

            this.setState({
                jyzs:jysl,
                khzs:khsl,
                ratedata:xiaolv,
                jindu_hh:jindu
            })
            // 累计月度年度
            var yearData=data.largeScreenModules
            var yearfj1=[]
            var yearfj2=[]
            yearData.forEach((element)=>{
                if(element.moduleDesc==='当日分拣情况'){
                    element.largeScreenModuleDetailes.forEach(element2 => {
                        if(element2.keyDesc==="年度分拣数量" || element2.keyDesc==="年度分拣客户" || element2.keyDesc==="年度分拣异形烟"){
                            yearfj1.push(parseInt(element2.value))
                        }else if(element2.keyDesc==="月度分拣数量" || element2.keyDesc==="月度分拣客户" || element2.keyDesc==="月度分拣异形烟"){
                            yearfj2.push(parseInt(element2.value))
                        }
                    });
                }
            })
            this.setState({
                yearfj:yearfj1,
                yearfj2:yearfj2
            })
           var arrter1 = [];
           for(let i=0;i<spliceData1.length;i+=3){
               arrter1.push(spliceData1.slice(i,i+3));
           }

            // 当日分拣情况
            var arrter = [];
            for(let i=0;i<spliceData.length;i+=3){
                arrter.push(spliceData.slice(i,i+3));
            }
             for(let j=0;j<title.length;j++){
                // title[j].data=arrter1[j]
                arrter[j].title=title[j].slice(2,title[j].length)
            }
            var arr=[]
            commoatin.forEach(element => {
                arr.push({
                    keyDesc:element.keyDesc,
                    value:element.value,
                    unitDesc:element.unitDesc

                })
                
            });
          
             //进行进度框值的判断，然后赋值给widthjd
            // 100% 342px 
            // console.log(arrter[2]); [{},{},{value:'342'}]
            console.log("数据",arrter);
            let progress = arrter.map((item,index)=>{
                return  Math.floor(item[2].value*3.42) 
            })
            console.log(progress);

            //把数据赋值给 banners 然后渲染在页面上 
            this.setState({
                TrueData:data,
                 fjsl:data.largeScreenModules,
                  fjsl1:arrter,
                  //  fjsl1:title,
                
                 fjsl2:arrter1,
                 dayKu:aaa,
                
                  //赋值给widthjd   
                widthjd:progress
               
            })
            // var drfjqk =[]
            // fjsl[0].forEach(element =>{
            //     drfjqk.push({


            //     })



            // })
            console.log(data.largeScreenModules,"data.largeScreenModule=s")
        })
       //this.zhfj()
    // 所有的或数据  TrueData
    }
    //加载饼状图
    getBing(type){

        const {ratedata,jindu_hh}=this.state;
        const cokrmain = [ "rgb(235,148,255)","rgb(3,216,255)","rgb(255,216,4)","rgb(4,91,255)","rgb(245,113,120)"];
        let total=0;
        let hha = []
        var txt_hh;
        if(type === "jindu"){
            hha = jindu_hh
            jindu_hh.forEach(element => {
                total+=element.value
            });
            txt_hh =  "%"
        }else{
            hha = ratedata
            ratedata.forEach(element => {
                total+=element.value
            });
            txt_hh =  "条/h"
        }
        console.log(total,'ttttttttttttttttttt')
      
        const optionrate = {
            title: [{
                text: `{val| ${total} }\n{name| 条/h}`,//\n{name|' + title + '}
                top: 'center',
                left: 'center',
                textStyle: {
                    rich: {
                        val: {
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: 'white',
                            padding: [10, 0]
                        },
                        name: {
                            fontSize: 12,
                            fontWeight: 'normal',
                            color: 'white',
                            padding: [5, 0]
                        }
                    }
                }
            }],
            series: [
              {
                type: 'pie',
                radius: ['60%', '80%'],
                hoverAnimation: true, 
                data: hha,
                itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#ddd',
                                fontSize:13,
                                formatter: function(params) {
                                    if(params.name !== '') {
                                        return  `${params.name} \n ${params.value}`+ txt_hh;
                                    }else {
                                        return '';
                                    }
                                },
                            },
                            color: function(params) {
                                return cokrmain[params.dataIndex]
                            },
                        }
                    }
                }
            ]
        };

        const rateChart = echarts.init(document.getElementById("variedpielist"));
        rateChart.setOption(optionrate);
    }
    // 累计
    getYear(){
        // var datalist=[6325, 6325, 6325, ]
        // var datalist2=[4225, 4225, 4225,]
        const optionratelist = {
            // title: {
            //     text: '世界人口总量',
            //     subtext: '数据来自网络'
            // },
            color:['#65D6FE','#528CEB'],
            tooltip: {
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['年度', '月度'],
                textStyle:{
                    fontSize: 15,//字体大小
                    color: '#ffffff'//字体颜色
               },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
               
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel: {
                    show: false,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 20,//字体大小
                       
                    }
                },
                splitLine:{
                    show:false
                }
            },
            yAxis: {
                axisLine:{
                    show:false
                
                },  
                axisTick: {
                    show: false
                },
                type: 'category',
                data: ['分拣数量/件', '分拣客户/件', '分拣异形烟/件', ], //这个是写死的？  echats写的 就是死的，肯定要根据数据来的 数据库没有这些 就是死的
                axisLabel : {
                    
                    textStyle: {
                        color: '#BACBE6',
                        fontSize: 15,//字体大小
                    }
                }

            },
            series: [
                {
                    name: '年度',
                    type: 'bar',
                    data: this.state.yearfj
                },
                {
                    name: '月度',
                    type: 'bar',
                    data: this.state.yearfj2
                }
            ]
        };
         // eslint-disable-next-line
        const rateChart = echarts.init(document.getElementById("variedpielist2"));
        rateChart.setOption(optionratelist); 
    }
    tabClick(type){
        this.getBing(type)
    }

    render() {
        const {widthjd,fjsl1,dayKu}=this.state;
        return (
            <div className="SmartSorting">
                 <div className="SmartSortingLeft Databack">
                    <span className="title">分拣概况</span>
                        <ul className="Sorting-main">
                             {
                                 
                                fjsl1.length>0&&fjsl1.map((item,index)=>{
                                   
                                    return(
                                            <li>
                                                <p className="Sorting-chlid-tit"><span></span><span>{item.title}</span></p>
                                                <p><span><i>{item[0].keyDesc}</i><i>{item[0].value}{item[0].unitDesc}</i></span><span><i>{item[1].keyDesc}</i><i>{item[1].value}{item[0].unitDesc}</i></span></p>
                                                <p><span>{item[2].keyDesc}</span><span><i style={{width:`${widthjd[index]}px`}}></i></span><span>{item[2].value}{item[2].unitDesc}</span></p>
                                            </li>
                                    )
                                })
                                // fjsl1.length>0&&fjsl1.map((item,index)=>{
                                //     return(
                                //             <li>
                                //                   <p className="Sorting-chlid-tit"><span></span><span>{item.keyDesc}</span></p>
                                //                {
                                                   
                                //                    item.data.map((item1,index)=>{
                                                       
                                //                 return(
                                //                     <div>
                                //                     <p><span><i>{item1.keyDesc}</i><i>{item1.value}{item.unitDesc}</i></span><span><i>{item1.keyDesc}</i><i>{item1.value}{item1.unitDesc}</i></span></p>
                                //                     <p><span>{item1.keyDesc}</span><span><i style={{width:`${widthjd}px`}}></i></span><span>{item1.value}{item1.unitDesc}</span></p>
                                //                     </div>
                                //                 )
                                //                    })
                                //                }
                                //             </li>
                                //     )
                                // })

                            } 
                       

                             {/* <li>
                                <p className="Sorting-chlid-tit"><span></span><span>分拣数量</span></p>
                                <p><span><i>总数量</i><i>5000条</i></span><span><i>总数量</i><i>2783条</i></span></p>
                                <p><span>进度</span><span><i style={{width:`${widthjd}px`}}></i></span><span>67%</span></p>
                            </li>
                            <li>
                                <p className="Sorting-chlid-tit"><span></span><span>分拣数量</span></p>
                                <p><span><i>总数量</i><i>5000条</i></span><span><i>总数量</i><i>2783条</i></span></p>
                                <p><span>进度</span><span><i style={{width:`${widthjd}px`}}></i></span><span>67%</span></p>
                            </li>
                            <li>
                                <p className="Sorting-chlid-tit"><span></span><span>分拣数量</span></p>
                                <p><span><i>总数量</i><i>5000条</i></span><span><i>总数量</i><i>2783条</i></span></p>
                                <p><span>进度</span><span><i style={{width:`${widthjd}px`}}></i></span><span>67%</span></p>
                            </li>  */}
                        </ul>
                        <div className="Sorting-total">
                         <p className="Sorting-chlid-tit"><span></span><span>累计</span></p>
                         <div id="variedpielist2" style={{height:"220px",marginTop:"-10px"}}>

                         </div>

                            {/* <p className="Sorting-chlid-pin"><span></span><span>年度</span><span></span><span>月度</span></p> */}
                             {/* {
                                // fjsl2.length>0&&fjsl2.map((item,index)=>{
                                //     return(
                                //         <ul className="Sorting-chlid-pin-echarts">
                                //           <li>
                                //               <p>{item[0].keyDesc}</p><p><span><i></i><i>{item[0].value}</i></span><span><i></i><i>{item[1].value}</i></span></p>
                               
                                //          </li>
                                {/* <li><p>{item[1].keyDesc}</p><p><span><i></i><i>{item[1].value}</i></span><span><i></i><i>{item[1].value}</i></span></p></li>
                                <li><p>{item[2].keyDesc}</p><p><span><i></i><i>{item[2].value}</i></span><span><i></i><i>{item[2].value}</i></span></p></li> */}
                            {/* </ul>
                              
                                    )
                                }) */}

                            {/* }  */} 
                             {/* {
                                fjsl2.length>0&&fjsl2.map((item,index)=>{
                                    return(
                                        <ul className="Sorting-chlid-pin-echarts">
                                            <li>
                                                <p>{item[0].keyDesc}</p><p><span><i></i><i>{item[0].value}</i></span><span><i></i><i>{item[1].value}</i></span></p>
                                        
                                            </li>
                                {/* <li><p>{item[1].keyDesc}</p><p><span><i></i><i>{item[1].value}</i></span><span><i></i><i>{item[1].value}</i></span></p></li>
                                <li><p>{item[2].keyDesc}</p><p><span><i></i><i>{item[2].value}</i></span><span><i></i><i>{item[2].value}</i></span></p></li> */}
                            {/* </ul>
                              
                                    )
                                }) */}

                            {/* }  */} 



                             </div>
                        {/* <div className="Sorting-total">
                            <p className="Sorting-chlid-tit"><span></span><span>累计</span></p>
                            <p className="Sorting-chlid-pin"><span></span><span>年度</span><span></span><span>月度</span></p>
                            <ul className="Sorting-chlid-pin-echarts">
                                <li><p>分拣数量/件</p><p><span><i></i><i>8325</i></span><span><i></i><i>4225</i></span></p></li>
                                <li><p>分拣数量/件</p><p><span><i></i><i>8325</i></span><span><i></i><i>4225</i></span></p></li>
                                <li><p>分拣数量/件</p><p><span><i></i><i>8325</i></span><span><i></i><i>4225</i></span></p></li>
                            </ul>
                        </div> */}

                 </div>


                 <div className="SmartSortingRight Databack">
                    <span className="title">当日分拣</span>
                        {/* 客户名称，线路名称重合 */}
                    <ul className="Site-distribution">
                        
                        {
                            dayKu.length>0?dayKu.slice(0,3).map((item,index)=>{
                                return(
                                    console.log(dayKu,"IMKF"),
                                    <li key={index}>
                                        <img src={item.img} alt=""/>
                                        <span><i>{item.keyDesc}</i><i>{item.value}</i></span>
                                    </li>

                                )
                            }):null

                        }
                        {/* <li><img src={require("../../assets/images/right/quyu-icon.png").default}  alt=""></img><span><i>进货区域</i><i>XX中转站</i></span></li>
                        <li><img src={require("../../assets/images/right/kehu-icon.png").default}  alt=""></img><span><i>客户名称</i><i>XX便利店</i></span></li>
                        <li><img src={require("../../assets/images/right/xianlu-icon.png").default}  alt=""></img><span><i>线路名称</i><i>XX线路</i></span></li> */}
                    </ul>

                    <div className="Sortingline">
                        <p className="Sortingline-tit"><span></span><span>分拣线</span></p>
                        <div id="Sortingline-listpie"></div>

                    </div>

                    <div className="Sortingpie">
                        <p className="Sortingpie-tit">
                            <span onClick={()=>this.tabClick("jindu")}>进度</span>
                            <span onClick={()=>this.tabClick("xiaolv")}>效率</span></p>
                        <div id="variedpielist" style={{paddingTop:"30px"}} >

                        </div>
                    
                    </div>

                 </div>
            </div>
        )
    }
}
