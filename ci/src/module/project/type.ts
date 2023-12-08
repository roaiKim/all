import { async } from "@core";

export const moduleName = "project";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "project" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "ty/project",
    title: "项目管理",
    order: 1,
    component: MainComponent,
};
