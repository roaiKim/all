import { bootstrap } from "@core";
// import locationListener from "locationListener";
import { MainComponent } from "module/common/main";
import ErrorHandler from "utils/ArrorListener";
// import "./utils/function/devtowindowenv";
import "asset/styles/index.less";

bootstrap({
    componentType: MainComponent,
    errorListener: new ErrorHandler(),
    idleTimeoutInSecond: 600,
    rootContainer: document.getElementById("app-root"),
    // browserConfig: {
    //     onLocationChange: locationListener,
    // },
});
