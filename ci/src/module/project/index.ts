import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./component";
import { State, moduleName } from "./type";

const initialState: State = {};

class ProjectModule extends Module<RootState, typeof moduleName> {
    async onEnter(params, location) {
        //
    }
}

const module = register(new ProjectModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
