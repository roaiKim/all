import { Lifecycle, Module, register } from "core";
import Main from "./component";

const initialState = {

};

class Game1Module extends Module {

  @Lifecycle()
    onRender() {
        console.log("game1 module action");
    }

}

const module = register(new Game1Module("game1", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
