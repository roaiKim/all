import { async } from "@core";

export const moduleName = "address";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "address" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/address",
    title: "Address",
    order: 1,
    component: MainComponent,
};
