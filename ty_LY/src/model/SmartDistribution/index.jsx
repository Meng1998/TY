import React, { Component } from 'react'
import { UeIfm as UrlIfream}  from '../../api/address' 

import './style.scss'

export default class SmartDistribution extends Component {
  
    render() {
        
        return ( 
            // eslint-disable-next-line
            <iframe  ref="iframe" scrolling="yes" frameBorder="0"
            style={{width:'100%',height:'100%', overflow:'visible' }}
            src={UrlIfream+"/#/map/mapHome"}
            />
         );
      
    }
}
