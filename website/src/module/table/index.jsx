import { Lifecycle, Module, register } from "core";
import { TableService } from "@api/TableService";
import Main from "./component";

const initialState = {
    table: null,
};

class TableModule extends Module {

    @Lifecycle()
    onRender() {
        TableService.getTable().then((response) => {
            this.setState({ table: response });
        }).catch((error) => {
            console.error("TableModule onRender", error);
        });
    }

    toLogin() {
        this.setHistory("/login");
    }

}

const module = register(new TableModule("table", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
