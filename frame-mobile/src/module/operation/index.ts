import { Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { RootState } from "type/state";
import { toLowerCamelCase } from "utils/function";
import Main from "./component";
import { moduleName, State } from "./type";

const initialOperationState = {};

class OperationModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    async onEnter(params, location) {
        //
        // console.log("-onEnter-project-", params, location);
    }

    onLocationMatched(routeParam: object, location): void {
        console.log("-onLocationMatched-project-", routeParam, location);
    }
}

const module = register(new OperationModule(toLowerCamelCase(moduleName), initialOperationState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
