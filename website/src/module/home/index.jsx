import { Lifecycle, Module, register } from "core";
import Main from "./component";

const initialState = {

};

class HomeModule extends Module {

  @Lifecycle()
    onRender() {
        console.log("home module action");
    }

}

const module = register(new HomeModule("home", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
