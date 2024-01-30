import { async } from "@core";

export const moduleName = "quality";

export const MainComponent = async(() => import(/* webpackChunkName: "project" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/quality",
    title: "质量统计",
    order: 3,
    bar: true,
    component: MainComponent,
};

export interface State {}
