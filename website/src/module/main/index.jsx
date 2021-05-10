import React from "react"
import Menu from "./Menu";
import Header from "./Header";
import "./index.less";

export default class extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            bodyHeight: document.body.clientHeight || 0
        }
    }
 
    render(){
        const {bodyHeight} = this.state

        return <aside className="ro-main-wrap">
            <Menu />
            <main className="ro-main" style={{minHeight: bodyHeight}}>
                <Header />
                <div></div>
            </main>
        </aside>
    }
}
