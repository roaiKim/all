import { async } from "@core";

export const moduleName = "waybill";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "waybill" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "s/waybill",
    title: "运单管理",
    order: 1,
    component: MainComponent,
};
