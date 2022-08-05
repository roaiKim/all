import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export const moduleName = "home";

export interface State {
    type: string | null;
    orders: Record<string, any>[];
}

export const MainComponent = async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/",
    title: "Home",
    order: 1,
    component: MainComponent,
};
