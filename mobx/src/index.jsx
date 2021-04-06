import ReactDOM from "react-dom";
import React from "react";
import Todo from "./Todo";
import Todo2 from "./Todo2";
import { observable } from "mobx";

/* ReactDOM.render(<div>
    <Todo></Todo>
    </div>,
document.getElementById("react-app")) */

const appStore = observable({
    count: 0
})

appStore.inc = function (){
    this.count++
}

appStore.dec = function (){
    this.count--
}


ReactDOM.render(<div>
    <Todo store={appStore}></Todo>
    </div>,
document.getElementById("react-app"))
