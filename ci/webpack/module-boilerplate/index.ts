import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import {1} from "./component";
import { State } from "./type";

const initialState: State = {};

class {2} extends Module<RootState, "{3}"> {
    @Loading()
    onEnter(params, location) {
        //
    }
}

const module = register(new {2}("{3}", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect({1});
