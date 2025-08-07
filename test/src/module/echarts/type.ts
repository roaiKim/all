import { async } from "@core";

export const moduleName = "echarts";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "echarts" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "",
    title: "echarts",
    order: 1,
    component: MainComponent,
};
