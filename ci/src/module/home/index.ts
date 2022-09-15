import { Loading, Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";
import { moduleName, State } from "./type";
import { StorageService } from "utils/StorageService";
import { OrderService } from "service/api/OrderService";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { initialTableSource } from "utils/function";

const initialState = {
    tableSource: initialTableSource(),
};

class HomeModule extends Module<RootState, typeof moduleName> {
    @Loading("table")
    async fetchPageTable() {
        const source = await AdvancedTableService.table({ pageNo: 1, pageSize: 200 });
        this.setState({ tableSource: source });
    }
}

const module = register(new HomeModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
