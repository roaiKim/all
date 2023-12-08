import { captureError, Loading, Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { RootState } from "type/state";
import { toLowerCamelCase } from "utils/business";
import { initialTableSource } from "utils/function";
import Home from "./component";
import { moduleName } from "./type";

const initialHomeState = {
    ...initialTableSource(),
};

class HomeModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    onEnter(parms: {}, location: Location): void {
        // this.fetchPageTable();
    }

    @Loading("table")
    async fetchPageTable(request = {}) {
        const source = await AdvancedTableService.table({ pageNo: 1, pageSize: 20, ...request }).catch((error) => {
            this.setState({ table: { ...this.state.table, sourceLoading: false, sourceLoadError: true } });
            captureError(error);
            return Promise.reject();
        });
        this.setState({ table: { ...this.state.table, source, sourceLoading: false, sourceLoadError: false } });
    }
}

const module = register(new HomeModule(toLowerCamelCase(moduleName), initialHomeState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
