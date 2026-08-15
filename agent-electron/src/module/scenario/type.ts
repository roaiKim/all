import { async } from "@core";

export const moduleName = "scenario";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "scenario" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/scenario",
    title: "Scenario",
    order: 1,
    component: MainComponent,
};
