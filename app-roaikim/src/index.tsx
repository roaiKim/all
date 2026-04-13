import { bootstrap } from "@core";
// import locationListener from "locationListener";
import { MainComponent } from "module/common/main";
import ErrorHandler from "utils/ArrorListener";
import cacheModules from "utils/function/load-modules";
// import "./utils/function/devtowindowenv";
import "asset/styles/index.less";
// modulesCache
console.log(cacheModules);
bootstrap({
    componentType: MainComponent,
    errorListener: new ErrorHandler(),
    idleTimeoutInSecond: 600,
    rootContainer: document.getElementById("app-root"),
    // browserConfig: {
    //     onLocationChange: locationListener,
    // },
});
