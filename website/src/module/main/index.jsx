import React from "react"
import Menu from "./Menu";
import Header from "./Header";
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
                <Header />
                <div></div>
            </main>
        </aside>
    }
}
