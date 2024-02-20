import { bootstrap } from "@core";
import locationListener from "locationListener";
import { MainComponent } from "module/common/main";
import "asset/less/index.less";

bootstrap({
    componentType: MainComponent,
    rootContainer: document.getElementById("ro-root-app"),
    browserConfig: {
        onLocationChange: locationListener,
    },
});
