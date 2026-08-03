import { Module, register } from "@core";
import type { RootState } from "type/rootState";
import { MainLoading } from "utils/decorator";
import Main from "./component";
import { moduleName, type State } from "./type";

const initialState: State = {};

class ManagementModule extends Module<RootState, typeof moduleName> {
    @MainLoading()
    async onEnter(params, location) {
        //
        console.log("--rr--");
    }
}

const module = register(new ManagementModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
