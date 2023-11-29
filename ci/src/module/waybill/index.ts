import { Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./component";
import { moduleName, State } from "./type";

const initialState: State = {};

class WaybillModule extends Module<RootState, typeof moduleName> {
    async onEnter(params, location) {
        //
        console.log("-onEnter-waybill-", params, location);
    }

    onLocationMatched(routeParam: object, location): void {
        console.log("-onLocationMatched-waybill-", routeParam, location);
    }
}

const module = register(new WaybillModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
