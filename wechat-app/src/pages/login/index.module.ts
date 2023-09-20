import { Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initialLoginState: State = {
    name: "login",
};

class LoginModule extends Module<RootState, "login"> {
    onEnter(params) {}
}

const module = register(new LoginModule("login", initialLoginState));
const actions = module.getActions();

export { module, actions };
