import { MainComponent } from "module/common/main";
import { bootstrap } from "@core";
import "asset/less/index.less";

bootstrap({
    componentType: MainComponent,
    rootContainer: document.getElementById("react-app"),
});
