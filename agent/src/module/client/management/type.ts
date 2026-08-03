import { async } from "@core";

export const moduleName = "management";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "management" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/management",
    title: "Management",
    order: 1,
    component: MainComponent,
};
