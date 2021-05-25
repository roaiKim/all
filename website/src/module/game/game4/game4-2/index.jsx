import { Lifecycle, Module, register } from "core";
import Main from "./component";

const initialState = {

};

class Game42Module extends Module {

  @Lifecycle()
    onRender() {
        console.log("game4_2 module action");
    }

}

const module = register(new Game42Module("game4_2", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
