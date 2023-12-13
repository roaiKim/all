import { Module, register } from "@core";
import { ToLowerCamelCase } from "type";
import { PageTableRequest } from "@api/AdvancedTableService";
import { RootState } from "type/state";
import { combineTable, toLowerCamelCase } from "utils/business";
import { loading } from "utils/decorator";
import { initialTableSource } from "utils/function";
import Main from "./component";
import { WaybillService } from "./server";
import { moduleName, State } from "./type";

const initialWaybillState: State = {
    table: initialTableSource(),
};

class WaybillModule extends Module<RootState, ToLowerCamelCase<typeof moduleName>> {
    onLocationMatched(routeParam: object, location): void {
        console.log("-onLocationMatched-waybill-", routeParam, location);
        // 需要打开详情的情况
        if (location.state?.id) {
            //
            this.pageTable();
        }
    }

    //
    @loading(moduleName)
    async pageTable(request?: PageTableRequest) {
        const response = await WaybillService.pageTable({
            offset: 0,
            limit: 20,
            pageNo: 1,
            pageSize: 20,
            selectColumns: ["*"],
            conditionBodies: [],
            orders: [{ orderBy: "createTime", ascending: false }],
            ...request,
        });
        this.setState({ table: combineTable(this.state.table, response) });
    }

    @loading("addition")
    addition() {
        //
    }
}

const module = register(new WaybillModule(toLowerCamelCase(moduleName), initialWaybillState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
