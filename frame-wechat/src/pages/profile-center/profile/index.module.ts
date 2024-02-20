import { Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initialProfileState: State = {
    name: "profile",
};

class ProfileModule extends Module<RootState, "profile"> {}

const module = register(new ProfileModule("profile", initialProfileState));
const actions = module.getActions();

export { actions, module };
