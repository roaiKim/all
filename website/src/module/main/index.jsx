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
                {[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,1,18,19,20,23,24].map((_) => <div key={_} style={{height: 120}}>
                    hahahahhhah hahahahha 
                </div>)}
            </main>
        </aside>
    }
}
