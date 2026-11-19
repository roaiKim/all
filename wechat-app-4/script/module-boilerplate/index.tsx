import { Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./component";
import { State } from "./type";

const initial{3}State: State = {
    name: "{2}",
};

class {1} extends Module<RootState, "{2}"> {}

const module = register(new {1}("{2}", initial{3}State));
export const actions = module.getActions();

export default module.connect(Main);
