import { Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initialProfileState: State = {
    name: null,
};

class ProfileModule extends Module<RootState, "profile"> {
    onEnter(): void {
        //
    }
}

const module = register(new ProfileModule("profile", initialProfileState));
const actions = module.getActions();

export { module, actions };
