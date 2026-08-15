import { bootstrap } from "@core";
import { MainComponent } from "module/main";
import ErrorHandler from "utils/ArrorListener";
import locationListener from "utils/framework/locationListener";
// import localModules from "utils/function/load-modules";
// import "./utils/function/devtowindowenv";
import "asset/styles/index.less";
// modulesCache
// console.log(localModules);
bootstrap({
    componentType: MainComponent,
    errorListener: new ErrorHandler(),
    idleTimeoutInSecond: 600,
    rootContainer: document.getElementById("app-root"),
    browserConfig: {
        onLocationChange: locationListener,
    },
});
