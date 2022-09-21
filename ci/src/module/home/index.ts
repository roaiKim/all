import { Loading, Module, register } from "@core";
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
        this.fetchPageTable();
    }

    @Loading("table")
    async fetchPageTable() {
        const response = await AdvancedTableService.title("s/waybill").catch((error) => {
            this.setState({ table: { ...this.state.table, columnLoading: false, columnLoadError: true, columns: null } });
        });
        let state = {};
        if (response) {
            const columns = transformTitle(response.commaListConfigData);
            state = { ...state, columnLoading: false, columnLoadError: false, columns };
        } else {
            // setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: false, columns: null }));
            state = { ...state, columnLoading: false, columnLoadError: false, columns: null };
        }
        const source = await AdvancedTableService.table({ pageNo: 1, pageSize: 10 });
        this.setState({ table: { ...this.state.table, ...state, source, sourceLoading: false, sourceLoadError: false } });
    }
}

const module = register(new HomeModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
