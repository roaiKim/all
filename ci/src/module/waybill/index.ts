import { Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { RootState } from "type/state";
import { toLowerCamelCase } from "utils/business";
import Main from "./component";
import { moduleName, State } from "./type";

const initialWaybillState: State = {};

class WaybillModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    async onEnter(params, location) {
        //
        console.log("-onEnter-waybill-", params, location);
    }

    onLocationMatched(routeParam: object, location): void {
        console.log("-onLocationMatched-waybill-", routeParam, location);
    }
}

const module = register(new WaybillModule(toLowerCamelCase(moduleName), initialWaybillState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
