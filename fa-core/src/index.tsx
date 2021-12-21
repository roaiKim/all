import { MainComponent } from "module/main";
import { bootstrap } from "@core";
import "./type/state";
// import "asset/css/index.less";

bootstrap({ componentType: MainComponent, rootContainer: document.getElementById("react-app") });
