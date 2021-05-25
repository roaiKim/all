import { Lifecycle, Module, register } from "core";
import Main from "./component";

const initialState = {

};

class Game41Module extends Module {

  @Lifecycle()
    onRender() {
        console.log("game4_1 module action");
    }

}

const module = register(new Game41Module("game4_1", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
