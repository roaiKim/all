import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export const moduleName = "waybill";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "waybill" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/waybill",
    title: "运单管理",
    order: 1,
    component: MainComponent,
};
