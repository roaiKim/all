import { captureError, Loading, Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";
import { moduleName, State } from "./type";
import { StorageService } from "utils/StorageService";
import { OrderService } from "service/api/OrderService";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { initialTableSource } from "utils/function";
import { transformTitle } from "components/page-table/utils";

const initialState = {
    ...initialTableSource(),
};

class HomeModule extends Module<RootState, typeof moduleName> {
    onEnter(parms: {}, location: Location): void {
        // this.fetchPageTable();
    }

    @Loading("table")
    async fetchPageTable() {
        const source = await AdvancedTableService.table({ pageNo: 1, pageSize: 10 }).catch((error) => {
            this.setState({ table: { ...this.state.table, sourceLoading: false, sourceLoadError: true } });
            captureError(error);
            return Promise.reject();
        });
        this.setState({ table: { ...this.state.table, source, sourceLoading: false, sourceLoadError: false } });
    }
}

const module = register(new HomeModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
