import { Lifecycle, Module, register } from "core";
import Main from "./component";

const initialState = {};

class HomeModule extends Module {
    @Lifecycle()
    onRender() {
        console.log("type module action");
    }
}

const module = register(new HomeModule("type", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
