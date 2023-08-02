import { Module, register } from "@core";
import { RootState } from "type";
import { State } from "./type";

const initialLoginModule: State = {
    name: "orderSearch",
};

class OrderSearchModule extends Module<RootState, "orderSearch"> {}

const module = register(new OrderSearchModule("orderSearch", initialLoginModule));
const actions = module.getActions();

export { module, actions };
