import { Lifecycle, Module, register } from "core";
import Main from "./component";

const initialState = {};

class UserModule extends Module {
    @Lifecycle()
    onRender() {
        console.log("user module action");
    }
}

const module = register(new UserModule("user", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
