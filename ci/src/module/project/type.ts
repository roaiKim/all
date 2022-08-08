import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export const moduleName = "project";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "project" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/project",
    title: "项目管理",
    order: 1,
    component: MainComponent,
};
