import ReactDOM from "react-dom";
import React from "react";
import {MainComponent} from "module/main";
import {bootstrarp} from "core";
import "asset/css/index.less";

bootstrarp({ entryComponent: MainComponent })

// ReactDOM.render(<Main />, document.getElementById("react-app"))
