import React, { Component } from 'react'
import {getStorage} from '../../api/mainApi'
// 引入 ECharts 主模块
import * as echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie';

import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import './style.scss'

export default class SmartStorage extends Component {
    constructor(props){
        super(props)
        this.state = {
            TrueData:[],
            zhcc:[],
            Strtotle:["108090","70529.98","003603"],
            ratedata:[{
                    name: '库区利用率',
                    value: 35,
                }, {
                    name: '当前库区数',
                    value: 65,
                }],
            Warehousdata:{
                left:[
                    {totol:0,color:"rgb(95,145,255)"},
                    {totol:0.6,color:"rgb(108,203,249)"}
                ],
                right:[ 
                    {totol:0,color:"rgb(106,228,246)"},
                    {totol:0,color:"rgb(243,157,115)"}
                ]
            },
            cczk:[],
            //  Warehousdata:{},
            
            CompletedSmartList:[
            
            ]

        }
        SmartStorage.this=this
      
    }

    componentDidMount(){
       
        this.LoadDta()
        this.CompletedSmartListppai()
         this.SortEcharts()
        
    }

    componentDidUpdate(){
        //this.LoadDta()
        // this.CompletedSmartListppai()
        this.SortEcharts()
    }




    EchartsReft(data,Imgrb) {
        console.log(Imgrb)
       return {
        title: [{
            text: `{val| ${data[0].value} }\n{name| ${data[1].value}}`,//\n{name|' + title + '}
            top: 'center',
            left: 'center',
            textStyle: {
                rich: {
                    val: {
                        fontSize: 13,
                        fontWeight: 'bold',
                     //   color: data[1].color,
                     color:"rgb(108,203,249)",
                        padding: [10, 0]
                    },
                    name: {
                        fontSize: 12,
                        fontWeight: 'normal',
                       // color: data[0].color,
                       color:"rgb(95,145,255)",
                        padding: [5, 0]
                    }
                }
            }
        }],
        
        legend: {
            orient: '',
            itemGap: 14,
            left:'1',
            top:'center',
            textStyle: {
                color: "#fff",
            },
            data: ['年', '月']
        },
        elements: [{
            type: "image",
            z: 9,
            style: {
                image: Imgrb,
                width: 100,
            },
            left: 'center',
            top: "10",
            // position: [100, 100]
        }],
        series: [
            {
                name: '年',
                type: 'pie',
                clockWise: false,
                    hoverAnimation: false, //鼠标移入变大
                    radius: ['77%', '90%'],
                
                itemStyle: {
                        normal: {
                       // color: data[0].color,
                       color:"rgb(95,145,255)",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                data: [{
                        value: 30,
                        name: 'invisible',
                        itemStyle: {
                            normal: {
                                color: 'rgba(141, 139, 139,0.2)',
                            },
                        }
                    },
                    {
                        value: 70,
                        name: '年'
                    }
                ]
            },
            {
                name: '月',
                type: 'pie',
                hoverAnimation: false, //鼠标移入变大
                clockWise: false,
                radius: ['59%', '72%'],
                itemStyle: {
                        normal: {
                       // color: data[1].color,
                       color:"rgb(108,203,249)",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                data: [{
                        value:60,
                        name: 'invisible',
                        itemStyle:  {
                            normal: {
                                color: 'rgba(108,203,249,0.01)',
                            },
                        }
                    },
                    {
                        value:40,
                        name: '月'
                    }

                ],

            }

            ]
        };
    }

    EchartsReftDay(data,Imgrb) {
        console.log(Imgrb)
       return {
        elements: [{
            type: "image",
            z: 9,
            style: {
                image: Imgrb,
                width: 100,
            },
            left: 'center',
            top: "10",
            // position: [100, 100]
        }],
        series: [
            {
                name: '年',
                type: 'pie',
                clockWise: false,
                    hoverAnimation: false, //鼠标移入变大
                    radius: ['80%', '90%'],
                
                itemStyle: {
                        normal: {
                        color: 'rgba(141, 139, 139,0)',
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                data: [{
                        value: 70,
                        name: 'invisible',
                        itemStyle: {
                            normal: {
                                color: 'rgba(141, 139, 139,0.2)',
                            },
                        }
                    },
                    {
                        value: 30,
                        name: '年'
                    }
                ]
            },
            {
                name: '月',
                type: 'pie',
                hoverAnimation: false, //鼠标移入变大
                clockWise: false,
                radius: ['68%', '78%'],
                itemStyle: {
                        normal: {
                       // color: data[1].color,
                        color:"rgb(108,203,249)",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                data: [{
                        value:70,
                        name: 'invisible',
                        itemStyle:  {
                            normal: {
                               // color: data[0].color,
                               color:"rgb(95,145,255)",
                            },
                        }
                    },
                    {
                        value:30,
                        name: '月'
                    }

                ],

            }

            ]
        };
    }
    LoadDta(){
        getStorage()
        .then(data => {
            
            //把数据赋值给 banners 然后渲染在页面上 
            this.setState({ 
                TrueData:data,
                // zhcc:data.largeScreenModules,
                CompletedSmartList:data.largeScreenModules
            })
            // console.log(data.largeScreenModules,"data.largeScreenModules")
        })

    }
 
    //   品牌汇总表
    async  CompletedSmartListppai(){
        getStorage()
        .then(data => {
            console.log(data,"我 的数据放到JFK")
            
            var commoatin=data.largeScreenModules[0].largeScreenModuleDetailes
            var commoatin2=data.largeScreenModules[1].largeScreenModuleDetailes
            var commoatin3=data.largeScreenModules[1].largeScreenModuleDetailes[3]
            var commoatin4=data.largeScreenModules[1].largeScreenModuleDetailes.slice(4,8) 
            // var commoatin5=data.largeScreenModules[1].largeScreenModuleDetailes.slice(4,8) 
    
            var initData=parseFloat(commoatin3.value)
           
           var arrlist=[
               {
                   name:commoatin3.keyDesc,
                   value:parseFloat(initData.toFixed(2))
               }
           ]
         


            var float= 100-initData.toFixed(2)
         
         
           //arrlist 的数据不全+
            arrlist.push({
                name: '当前库区数',  
                value: float,

            })
          
           console.log(arrlist,'wssopq')
         
            var arr=[]
            var arr1=[]
            var arr2=[]
          
            commoatin.forEach(element => {
                arr.push({
                    // 
                    keyDesc:element.keyDesc,
                    value:element.value,
                    unitDesc:element.unitDesc
                })
            });
            
            commoatin2.forEach(element => {
                arr1.push({
                    // 
                    keyDesc:element.keyDesc,
                    value:element.value,
                    unitDesc:element.unitDesc
                })
            });
            commoatin4.forEach(element => {
                arr2.push({
                    // 
                    keyDesc:element.keyDesc,
                    value:element.value,
                    unitDesc:element.unitDesc
                })
            });
            var left=[]
            var right=[]
            left=left.concat(commoatin4[0]).concat(commoatin4[1])
            right=right.concat(commoatin4[2]).concat(commoatin4[3])
        // /
          
            console.log(left,"左边的",right,"右边的")
            this.setState({ 
                
                CompletedSmartList:arr,
                cczk:arr1,
                ratedata:arrlist,
                Warehousdata:{
                    left:left,
                    right:right
                }
            })
         
    
       
        })
    
    }

    // 库存 表格

   async SortEcharts(){
       //this.CompletedSmartListppai()
        const {ratedata,Warehousdata}=this.state;
        console.log(typeof(ratedata))
        console.log(ratedata,"error") // 
      

        const cokrmain = [ "rgb(95,145,255)","rgb(108,203,249)"];
        const optionrate = {
            series: [
              {
                type: 'pie',
                left:20,
                radius: ['28%', '80%'],
                data: ratedata,
                itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#ddd',
                                formatter: function(params) {
                                    var percent = 0;
                                    var total = 0;
                                    for (var i = 0; i < ratedata.length; i++) {
                                        total += ratedata[i].value;
                                    }
                                    percent = ((params.value / total) * 100).toFixed(2);
                                    // 58.15  
                                  
                                    if(params.name !== '') {
                                        return  `${params.name} \n \n 占百分比： ${percent}  %`;
                                    }else {
                                        return '';
                                    }
                                },
                            },
                            color: function(params) {
                                return cokrmain[params.dataIndex]
                            }
                        }
                        
                    }
                   
                }
            ]
        };
         // eslint-disable-next-line
        const rateChart = echarts.init(document.getElementById("Storage-rate-echarts"));
        rateChart.setOption(optionrate); 


       
        let Imglight=require("../../assets/images/right/iocn-1.png").default;

        const Warehousleft = echarts.init(document.getElementById("Warehous-left-echarts"));
        Warehousleft.setOption(this.EchartsReft(Warehousdata.left,Imglight));

        const Warehousright = echarts.init(document.getElementById("Warehous-right-echarts"));
        Warehousright.setOption(this.EchartsReft(Warehousdata.right,Imglight));

        const DaySmart = echarts.init(document.getElementById("Main-echarts-day"));
        DaySmart.setOption(this.EchartsReftDay(Warehousdata.left,Imglight));
    }
    render() {
        const {CompletedSmartList}=this.state
        return (
            <div className="SmartStorage">
                <div className="SmartStorageLeft Databack">
                    <span className="title">仓储概况</span>
                    <div className="Storage-totle">
                        {
                            this.state.cczk.slice(0,3).map((item,index)=>{
                                return(
                                    <p>
                                       <span style={{color:"white"}}>{item.keyDesc}/{item.unitDesc}</span><span style={{letterSpacing:"2px"}}><i>{item.value}</i></span>   
                                    </p>
                                )
                            })

                        }
                        {/* <p><span>库区总库容/件</span><span><i>1</i><i>0</i><i>8</i><i>0</i><i>9</i><i>0</i></span></p>
                        <p><span>当前库件/件</span><span><i>7</i><i>0</i><i>5</i><i>2</i><i>9</i>.<i>9</i><i>8</i></span></p>
                        <p><span>库区货位数/件</span><span><i>0</i><i>0</i><i>3</i><i>6</i><i>0</i><i>3</i></span></p> */}
                    </div>

                    <div class="Storage-rate">
                        <p><span></span><span>库区利用率</span></p>
                        <div id="Storage-rate-echarts"></div>
                    </div>

                    <div className="Storage-Warehous">
                    <p className="tit"><span></span><span>累计出入库</span></p>
                    <div className="Warehous-host">
                        <div id="Warehous-left-echarts"></div>
                        {/* <p className="tit-bottom">当年度累计<span>入库</span>总数：<spna>1567500.6</spna>条</p>
                        <p className="tit-bottom">当月度累计<span>入库</span>总数：<spna>203347.32</spna>条</p> */}
                        {
                             this.state.cczk.slice(4,6).map((item,index)=>{
                                return(
                                  <p className="tit-bottom">{item.keyDesc}：<span style={{color:"#588AF8 "}}>{item.value}</span>{item.unitDesc}</p> 
                                )
                            })


                        }
                    </div>
                    <div className="Warehous-host">
                        <div id="Warehous-right-echarts"></div>
                        {
                             this.state.cczk.slice(6,8).map((item,index)=>{
                                return(
                                  <p className="tit-bottom">{item.keyDesc}：<span style={{color:"#5FC9E6"}}>{item.value}</span>{item.unitDesc}</p> 
                                )
                            })


                        }
                    </div>
                    </div>
                </div>


                <div className="SmartStorageRight Databack">
                    <span className="title">当日入库</span>
                    <div className="DaySmart">
                        <div className="Around">
                            {/* <span>已完成/条</span>
                            <span className="AroundY">1787</span> */}
                              {
                             this.state.cczk.slice(8,9).map((item,index)=>{
                                return(
                                    <p>
                                    <span>{item.keyDesc}/{item.unitDesc}</span>
                                    <span className="AroundY">{item.value}</span>
                                    </p>
                                )
                            })


                        }
                        </div>
                        <div id="Main-echarts-day" className=" Around"></div>
                        <div className="Around">
                            {/* <span>待入库/条</span>
                            <span className="AroundD">0</span> */}
                             {
                             this.state.cczk.slice(9,10).map((item,index)=>{
                                return(
                                    <p>
                                    <span>{item.keyDesc}/{item.unitDesc}</span>
                                    <span className="AroundD">{item.value}</span>
                                    </p>
                                )
                            })


                        }
                        </div>
                    <span className="F-log"></span>
                    </div>

                    <div class="ConductSmart">
                        <p><span></span><span>当前正在入库</span></p>
                        <ul className="ConductSmart-echarts">
                            {/* <li><span>卷烟名称</span><span>卷烟数量/条</span></li>
                            <li><span>玉溪</span><span>893</span></li> */}
                            {
                             this.state.cczk.slice(10,11).map((item,index)=>{
                                return(
                                    <ul>
                                     <li><span>卷烟名称</span><span>卷烟数量/条</span></li>
                                     <li><span>{item.value}</span><span>{item.unitDesc}</span></li>
                                     </ul>
                                  
                                )
                            })


                        }
                        </ul>
                    </div>

                    <div class="CompletedSmart">
                        <p><span></span><span>已完成入库品牌汇总表</span></p>
                        <ul className="CompletedSmart-Tab" style={{fontSize:"13px "}}>
                          
                                <li><span>序号</span><span>厂家</span><span>卷烟名称</span><span>数量</span></li>
                                {/* 增加滚动条 */}
                            {CompletedSmartList.map((item,key)=>(
                                <li key={key}><span>{key+1}</span><span>{item.keyDesc}</span><span>{item.value}</span><span>{item.unitDesc}</span></li>
                            ))}
                             
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
