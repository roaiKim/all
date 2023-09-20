import { Module, register } from "@core";
import { RootState } from "type/state";
import { ValidateAuth } from "utils/decorator/validateAuth";
import { State } from "./type";

const initialUserState: State = {
    name: "user",
};

@ValidateAuth
class UserModule extends Module<RootState, "user"> {}

const module = register(new UserModule("user", initialUserState));
const actions = module.getActions();

export { module, actions };
