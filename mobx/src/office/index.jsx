import React from "react";
import ReactDOM from "react-dom";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

class Timer {
    secondsPassed = 0;

    constructor(){
        makeAutoObservable(this);
    }

    increase() {
        this.secondsPassed += 1;
    }

    reset() {
        this.secondsPassed = 0;
    }
}

const myTimer = new Timer();

const TimerView = observer(({timer}) => <React.Fragment>
    <button onClick={() => timer.reset()}>pass: {timer.secondsPassed} </button>
</React.Fragment>)

ReactDOM.render(<TimerView timer={myTimer}/>, document.getElementById("react-app"))

window.myTimer = myTimer;