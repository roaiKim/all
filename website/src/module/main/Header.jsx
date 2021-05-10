import React from "react"
import {MenuFoldOutlined, ExpandOutlined, SettingOutlined, BellOutlined} from "icon"
import { Input } from 'antd';

export default class extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {

        }
    }
 
    render(){
        const {Component} = this.state

        return (<header className="ro-main-header">
            <div className="ro-icon ro-left-aside">
                <MenuFoldOutlined />
                <ExpandOutlined />
            </div>
            <div className="ro-icon ro-right-aside ro-flex ro-align-items">
                <Input.Search />
                <BellOutlined />
                <a href="#" className="ro-profile">
                    <span>rosen</span>
                    <img src={require("asset/images/global/header.jpg")}></img>
                </a>
                <SettingOutlined />
            </div>
        </header>)
    }
}
