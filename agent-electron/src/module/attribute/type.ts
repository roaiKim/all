import { async } from "@core";

export const moduleName = "attribute";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "attribute" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/attribute",
    title: "Attribute",
    order: 1,
    component: MainComponent,
};
