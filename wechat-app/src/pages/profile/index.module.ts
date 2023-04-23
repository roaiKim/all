import { Module, register } from "@core";
import { RootState } from "type";
import { State } from "./type";

const initialLoginModule: State = {
    name: "profile",
};

class HomeModule extends Module<RootState, "profile"> {}

const module = register(new HomeModule("profile", initialLoginModule));
const actions = module.getActions();

export { module, actions };
