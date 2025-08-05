import { Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { RootState } from "type/state";
import { toLowerCamelCase } from "utils/business";
import Main from "./component";
import { moduleName, State } from "./type";

const initialProjectState = {};

class ProjectModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    async onEnter(params, location) {
        //
        // console.log("-onEnter-project-", params, location);
    }

    onLocationMatched(routeParam: object, location): void {
        // console.log("-onLocationMatched-project-", routeParam, location);
    }

    push() {
        this.setNavigationPrevented(true);
    }
}

const module = register(new ProjectModule(toLowerCamelCase(moduleName), initialProjectState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
