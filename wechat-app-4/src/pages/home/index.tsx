import { Module, register } from "@core";
import { RootState } from "@type/state";
import Main from "./component";
import { State } from "./type";

const initialHomeState: State = {
    name: "home",
};

class HomeModule extends Module<RootState, "home"> {}

const module = register(new HomeModule("home", initialHomeState));
export const actions = module.getActions();

export default module.connect(Main);
