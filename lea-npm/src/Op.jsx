import React from "react";

export default class extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            Component: null
        }
    }

    getLazly = async () => {
        const tui = await import(/* webpackChunkName: "LazlyImport" */ "./LazlyImport")
        console.log("tui", React.isValidElement(tui), tui)

        this.setState({Component: tui.default})
    }

    /* getLazly = () => {
        console.log("uisisi")
    } */

    render(){
        const {Component} = this.state
        return <div>opopop 热更新 retihuan
            <a href="https://www.baidu.com" download="filema">baidu</a>
            <button onClick={this.getLazly}>提交</button>
            {Component && <Component />}
        </div>
    }
}


export class YU extends React.PureComponent {
    render(){
        return <div>duoyua</div>
    }
}

export class TreeS extends React.PureComponent {
    render(){
        return <div>TreeSTreeS</div>
    }
}