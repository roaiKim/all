import { Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { PageTableRequest } from "@api/AdvancedTableService";
import { RootState } from "type/state";
import { combineAddition, combineTable, defaultPageTableRequest, initialTableSource, toLowerCamelCase } from "utils/business";
import { additionLoading, loading, pageLoading } from "utils/decorator";
import Main from "./component";
import { WaybillService } from "./service";
import { moduleName, State } from "./type";

const initialWaybillState: State = {
    table: initialTableSource(),
    addition: null,
};

class WaybillModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    onLocationMatched(routeParam: object, location): void {
        console.log("-onLocationMatched-waybill-", routeParam, location);
        if (location.state?.id) {
            const { id, readonly } = location.state;
            // this.addition(id, readonly);
            this.pageTable();
        }
    }

    @pageLoading()
    async pageTable(request?: Partial<PageTableRequest>) {
        const response = await WaybillService.pageTable(defaultPageTableRequest(request));
        this.setState({ table: combineTable(this.state.table, response) });
    }

    @additionLoading()
    async addition(id: string, readonly = true) {
        const response = await WaybillService.addition(id);
        this.setState({ addition: combineAddition(this.state.addition, response, { additionReadonly: readonly }) });
    }
}

const module = register(new WaybillModule(toLowerCamelCase(moduleName), initialWaybillState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
