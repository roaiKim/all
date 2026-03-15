// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// const rootEl = document.getElementById("app");
// if (rootEl) {
//     const root = ReactDOM.createRoot(rootEl);
//     root.render(
//         <React.StrictMode>
//             <App />
//         </React.StrictMode>
//     );
// }

import { bootstrap } from "@core";
import ErrorHandler from "errorListener";
// import locationListener from "locationListener";
import { MainComponent } from "module/common/main";
// import "./utils/function/devtowindowenv";
import "asset/styles/index.less";

bootstrap({
    componentType: MainComponent,
    errorListener: new ErrorHandler(),
    // rootContainer: document.getElementById("react-app"),
    // browserConfig: {
    //     onLocationChange: locationListener,
    // },
});
