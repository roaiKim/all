import React from "react"
import {observable} from "mobx"
import {observer} from "mobx-react"

@observer
class Todo extends React.Component{
    id = Math.random();

    @observable
    title = ""

    @observable
    count = 0

    @observable
    finished = false;

    handleInc = () => {
        this.count++
    }

    handleDec = () => {
        this.count--
    }

    render(){
        return <div>
            count: {this.count}
            <br/>
            <button onClick={this.handleInc}>+++</button>
            <button onClick={this.handleDec}>---</button>
        </div>
    }
}

export default Todo;










