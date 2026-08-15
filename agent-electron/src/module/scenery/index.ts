import { Module, register } from "@core";
import type { RootState } from "type/rootState";
import { MainLoading } from "utils/decorator";
import Main from "./component";
import { moduleName, type State } from "./type";

const initialState: State = {};

class SceneryModule extends Module<RootState, typeof moduleName> {
    @MainLoading()
    async onEnter(params, location) {
        //
    }
}

const module = register(new SceneryModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
