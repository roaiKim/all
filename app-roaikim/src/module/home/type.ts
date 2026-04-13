import { async } from "@core";

export const moduleName = "home";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/home",
    title: "Home",
    order: 1,
    component: MainComponent,
};
