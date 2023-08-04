import { Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initialLoginModule: State = {
    name: null,
};

class LoginModule extends Module<RootState, "login"> {
    onEnter(params) {}
}

const module = register(new LoginModule("login", initialLoginModule));
const actions = module.getActions();

export { module, actions };
