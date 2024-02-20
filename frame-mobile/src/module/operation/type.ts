import { async } from "@core";

export const moduleName = "operation";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "finance" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/operation",
    title: "运营统计",
    order: 2,
    bar: true,
    component: MainComponent,
};
