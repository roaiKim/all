import { Lifecycle, Module, register } from "core";
import { TableService } from "@api/TableService";
import Main from "./component";

const initialState = {
    table: null,
};

class TableModule extends Module {

    @Lifecycle()
    onRender() {
        console.log("tabless module action");
        TableService.getTable().then((response) => {
            console.log("response", response);
            this.setState({ table: response });
        }).catch((bb) => {
            console.log("bb", bb);
        });
    }

}

const module = register(new TableModule("table", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
