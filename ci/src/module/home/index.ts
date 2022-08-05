import { Loading, Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";
import { moduleName, State } from "./type";
import { StorageService } from "utils/StorageService";
import { OrderService } from "service/api/OrderService";

const initialState = {
    type: null,
    orders: null,
};

class HomeModule extends Module<RootState, typeof moduleName> {
    //
}

const module = register(new HomeModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
