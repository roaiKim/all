import { MainComponent } from "module/main";
import { bootstrap } from "@core";
import "asset/less/normalize.less";

bootstrap({
    componentType: MainComponent,
    rootContainer: document.getElementById("react-app"),
});
