import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./component";
import { State, moduleName } from "./type";

const initialState: State = {};

class {1} extends Module<RootState, typeof moduleName> {
    @Loading()
    async onEnter(params, location) {
        //
    }
}

const module = register(new {1}(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
