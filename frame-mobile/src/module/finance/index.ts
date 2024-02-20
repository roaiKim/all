import { captureError, Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { RootState } from "type/state";
import { loading } from "utils/decorator";
import { toLowerCamelCase } from "utils/function";
import Finance from "./component";
import { moduleName } from "./type";

const initialFinanceState = {
    name: null,
};

class FinanceModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    onEnter(parms: {}, location: Location): void {
        // this.fetchPageTable();
    }

    @loading("table")
    async fetchPageTable(request = {}) {
        //
    }
}

const module = register(new FinanceModule(toLowerCamelCase(moduleName), initialFinanceState));
export const actions = module.getActions();
export const MainComponent = module.connect(Finance);
