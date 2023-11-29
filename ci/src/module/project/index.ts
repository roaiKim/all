import { Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./component";
import { moduleName, State } from "./type";

const initialState: State = {};

class ProjectModule extends Module<RootState, typeof moduleName> {
    async onEnter(params, location) {
        //
        console.log("-onEnter-project-", params, location);
    }

    onLocationMatched(routeParam: object, location): void {
        console.log("-onLocationMatched-project-", routeParam, location);
    }
}

const module = register(new ProjectModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
