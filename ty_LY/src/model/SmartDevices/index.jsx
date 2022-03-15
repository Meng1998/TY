import React, { Component,Fragment } from 'react';
// import Socekt from '../../Socekt'
import {DispatchInfoOne,DispatchInfoOneExist,DispatchInfoTwo,DispatchInfoThree,DispatchInfoText} from '../../api/mainApi';
import {Common} from '../../pages/Map/map3d'
import { UeIfm as UrlIfream}  from '../../api/address' 
import './style.scss'
class SmartDevices extends Component {
        constructor(props){
            super(props)
            this.state={
                TsetRead:true,
                Liststr:[],
                Liststatic:false
            }
        }


    DataDh(){
        Common.ZTDHInit();
        var _this=this;
       

        DispatchInfoOneExist().then(res=>{
            if(res.msg==="200"){
                let i=1;
                console.log("res.data",res.data)
                res.data.forEach(element => {
                     if(element.length>0){
                        Common.DHmodel('GD'+i,true)
                     }else{
                        Common.DHmodel('GD'+i,false)
                     }
                     i++;
                });
                console.log('GDOOD')
            }
        })
        setTimeout(function(){
           
            DispatchInfoOne().then(res=>{
                if(res.msg==="200"){
                    res.data.forEach(element => {
                        Common.DHmodel('GD1',false)
                        _this.Suhy(element);
                    });
                }
            })
            
            DispatchInfoTwo().then(res=>{
                if(res.msg==="200"){
                    res.data.forEach(element => {
                        _this.Suhy(element);
                    });
                }
            })
    
            DispatchInfoThree().then(res=>{
                if(res.data.length>0){
                    res.data.forEach(element => {
                        //debugger
                        _this.Suhy(element);
                        
                    });
                }
            })
    
            DispatchInfoText().then(res=>{
                    _this.setState({
                        Liststr:res.data
                       })
                    console.log( _this.state.Liststr,"ThisBG")
            })
        },500)
           
        console.log("TsetFalse",this.state.TsetRead)
    }    
        
    Paty(){
        const {TsetRead}=this.state;
        var str;
        this.setState({
            TsetRead:!TsetRead,
            Liststatic:TsetRead
           })
        var _this=this;
        setTimeout(function(){
            Common.DHmodel('V001_JZ0001_WK',_this.state.TsetRead)
           if(!_this.state.TsetRead) {
           
            _this.DataDh();
           }
            str= setInterval(function(){
                if(_this.state.TsetRead){
                    clearInterval(str)
                    console.log("TsetTrue",_this.state.TsetRead)
                    return
                }else{
                    _this.DataDh()
                  
                }
            },15000);//10分钟执行一次
            
        },500)
    }
    Suhy(rel){
        switch(rel[4]){
            case "1":
                    console.log("menkou1")
                    Common.DHmodel('menkou',true)
                break;
            case "2":
                if(rel[5]==="111"){
                    console.log("menkou2")
                    Common.DHmodel('GD2',false)
                    Common.DHmodel('XHYD',true)
                }else{
                    console.log("menkou3")
                    Common.DHmodel('GD3',false)
                    Common.DHmodel('XHED',true)
                }
                break;
            case "3":
                if(rel[5]==="111"){
                    console.log("menkou4")
                    Common.DHmodel('CMYD',true)
                }else{
                    console.log("menkou5")
                    Common.DHmodel('CMED',true)
                }
                break;
            default:
                break;
        }
    }

    CloseImges(){
        this.setState({ 
            Liststatic:false
        })
    }
    render() { 
        const {TsetRead,Liststr,Liststatic}=this.state;
        return ( 
            <Fragment>
        {
        // eslint-disable-next-line
        TsetRead? <iframe  ref="iframe" scrolling="yes" frameBorder="0"
            style={{width:'100%',height:'100%', overflow:'visible',marginTop:'65px'}}
            src={UrlIfream+"/#/homeMap/MapDetail"}
        />:
        ""
        }
        {Liststatic?
            <div className="ListInfo">
            <ul className="CompletedSmart-Tab" style={{fontSize:"13px "}}>
                    <li className="Tab-Th"><span>车牌号</span><span>所属工业名称</span><span>卸货门</span><span>卷烟品牌</span><span>数量</span></li>
                {Liststr.length>0?Liststr.map((item,key)=>(
                    <li key={key}><span>{item[2]}</span><span>{item[3]}</span><span>{item[5]}</span><span>{item[6]}</span><span>{item[1]}</span></li>
                )):""}

            </ul>
        </div>:""
        }
             {/* <li key={0}><span></span><span></span><span></span><span></span><span></span></li> */}
        <img className="CenImg"  onClick={()=>this.Paty()} src={require("../../assets/images/shuzihua.png").default} alt=''/>
        </Fragment>
        
         );
    }
}
export default SmartDevices;