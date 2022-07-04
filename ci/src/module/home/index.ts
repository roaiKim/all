import { Loading, Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";
import { State } from "./type";
import { StorageService } from "utils/StorageService";
import { OrderService } from "service/api/OrderService";

const initialState = {
    type: null,
    orders: null,
};

class HomeModule extends Module<RootState, "home"> {
    //
}

const module = register(new HomeModule("home", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
