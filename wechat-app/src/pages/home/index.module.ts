import { Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initialLoginModule: State = {
    name: "home",
};

class HomeModule extends Module<RootState, "home"> {}

const module = register(new HomeModule("home", initialLoginModule));
const actions = module.getActions();

export { module, actions };
