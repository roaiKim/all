import { async } from "@core";

export const moduleName = "package";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "package" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/package",
    title: "Package",
    order: 1,
    component: MainComponent,
};
