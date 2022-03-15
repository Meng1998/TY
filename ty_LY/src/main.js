import React, { Component } from 'react'
import {HashRouter,Route} from "react-router-dom";
import Homer from './pages/home/index'

export default class Main extends Component {
    render() {
        return(
                <HashRouter>
                        {/* <Route path="/login" exact component={Login}  onEnter={()=>{document.title='平台登录'}}></Route> */}
                        <Route path="/" component={Homer} ></Route>
                </HashRouter>
        )
    }
}
