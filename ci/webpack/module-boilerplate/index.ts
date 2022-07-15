import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./component";
import { State } from "./type";

const initialState: State = {};

class {1} extends Module<RootState, "{2}"> {
    @Loading()
    onEnter(params, location) {
        //
    }
}

const module = register(new {1}("{2}", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
