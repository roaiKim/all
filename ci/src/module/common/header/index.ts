import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";

const initialState = {
    userName: null,
    prevPathname: null,
};

class HeaderModule extends Module<RootState, "header"> {
    //
}

const module = register(new HeaderModule("header", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
