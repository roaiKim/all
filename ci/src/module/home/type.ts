import { AdvancedTableResponse } from "@api/AdvancedTableService";
import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export const moduleName = "home";

export interface State {
    tableSource: AdvancedTableResponse<any>;
}

export const MainComponent = async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/:id(home)?",
    title: "Home",
    order: 1,
    component: MainComponent,
};
