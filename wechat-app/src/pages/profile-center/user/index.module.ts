import { Module, register } from "@core";
import { RootState } from "type/state";
import { verifiable } from "utils/decorator/verifiable";
import { State } from "./type";

const initialUserState: State = {
    name: "user",
};

// @verifiable
class UserModule extends Module<RootState, "user"> {}

const module = register(new UserModule("user", initialUserState));
const actions = module.getActions();

export { module, actions };
