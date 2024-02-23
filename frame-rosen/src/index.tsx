import { bootstrap } from "@core";
import ErrorHandler from "errorListener";
import locationListener from "locationListener";
import { MainComponent } from "module/common/main";
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
