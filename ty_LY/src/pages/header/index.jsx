import React, { Component } from 'react'
import {Common} from '../../pages/Map/map3d'
import './style.scss'

export default class Header extends Component {
    constructor(props){
        super(props)
        this.state={
            getDayXq:"星期一",
            DayNYR:"",
            DaySFM:""
        }
        
    }
    componentDidMount(){
     var _this=this;
        setInterval(function () {
            _this.getWeekDate() 
            var date = new Date();//获得当前时间
            var yy = date.getFullYear();//年份
            var mm = date.getMonth() + 1;//获得月份
            mm = (mm < 10 ? "0" + mm : mm);//月份小于10时，前面加个0(例如9 ->09)天，小时，分钟，秒同理
            var dd = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());//天
            var hours = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());//小时
            var minutes = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());//分钟
            var seconds = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());//秒
            
            _this.setState({
                DayNYR:yy + '/' + mm + "/" + dd,
                DaySFM:hours + ':' + minutes + ':' + seconds
            })
            }, 1000);
    }
     getWeekDate() {
        let now = new Date();
        let day = now.getDay();
        let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let week = weeks[day];
        this.setState({
            getDayXq:week
        })
     }

     getLocation(){
       Common.getlocation();
     }
    render() {
     const {getDayXq,DayNYR,DaySFM}=this.state;
     const {choiceIndex,PagesSet,toplist}=this.props;
        return (
            <div className="Header">
                <ul className="Header-left">
                    <li ><span>{DaySFM}</span><span>{DayNYR} {getDayXq}</span></li>
                    {toplist.map((item,key)=>(
                        <li className="Header-left-img " style={choiceIndex===key?{color:"white"}:null} onClick={()=>PagesSet(key)} key={key}><img src={require(`../../assets/images/header/${item.url}`).default} alt=""></img><span>{item.name}</span></li>
                    ))}
                    <li className="Titletxt">临沂烟草智慧物流</li>
                    <li className="Mainbtn"><img onClick={()=>this.getLocation()}  src={require("../../assets/images/home-icon.png").default} alt='' /></li>
                </ul>
            </div>
        )
    }
}
