import React from "react"
import Menu from "./Menu";
import "./index.less";

export default class extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {

        }
    }
 
    render(){
        const {Component} = this.state

        return <aside className="ro-main-wrap">
            <Menu />
            <main className="ro-main">
                <header className="ro-main-header">sssssss</header>
                <div></div>
            </main>
        </aside>
    }
}
