import { MainComponent } from "module/home";
import React from "react";
import { bootstrap } from "core";
// import "asset/css/index.less";

function Main() {
    const as = () => {
        throw new Error("出错");
    };
    return <div onClick={as}> fa-core sss</div>;
}

bootstrap({ componentType: MainComponent, rootContainer: document.getElementById("react-app") });
// import React from "react";
// import ReactDOM from "react-dom";

// function Main() {
//     return <div> fa-core sss</div>;
// }

// ReactDOM.render(<Main />, document.getElementById("react-app"));
