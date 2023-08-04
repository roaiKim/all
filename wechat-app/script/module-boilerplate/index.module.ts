import { Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initial{3}State: State = {
    name: null,
};

class {1} extends Module<RootState, "{2}"> {}

const module = register(new {1}("{2}", initial{3}State));
const actions = module.getActions();

export { module, actions };
