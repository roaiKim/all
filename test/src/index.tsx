import ReactDOM from "react-dom";
import { bootstrap } from "@core";
import ErrorHandler from "errorListener";
import locationListener from "locationListener";
import { MainComponent } from "module/common/main";
// import Main from "module/main";
import "./utils/function/devtowindowenv";
import "asset/less/index.less";

bootstrap({
    componentType: MainComponent,
    errorListener: new ErrorHandler(),
    rootContainer: document.getElementById("react-app"),
    browserConfig: {
        onLocationChange: locationListener,
    },
});

function injectRootContainer(): HTMLElement {
    const rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}

// ReactDOM.render(
//     <div>
//         <MainComponent />
//     </div>,
//     document.getElementById("react-app")
// );
