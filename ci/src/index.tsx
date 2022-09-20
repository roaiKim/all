import { MainComponent } from "module/common/main";
import { bootstrap } from "@core";
import "asset/less/index.less";
import ErrorHandler from "errorListener";
import locationListener from "locationListener";

bootstrap({
    componentType: MainComponent,
    errorListener: new ErrorHandler(),
    rootContainer: document.getElementById("react-app"),
    browserConfig: {
        onLocationChange: locationListener,
    },
});
