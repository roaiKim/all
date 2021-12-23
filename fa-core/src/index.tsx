import { MainComponent } from "module/main";
import { bootstrap } from "@core";

bootstrap({
    componentType: MainComponent,
    rootContainer: document.getElementById("react-app"),
});
