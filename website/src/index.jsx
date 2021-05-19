import ReactDOM from "react-dom";
import React from "react";
import Main from "module/main";
import {startApp} from "core";
import "asset/css/index.less";

startApp({
    componentType: Main
})

// ReactDOM.render(<Main />, document.getElementById("react-app"))
