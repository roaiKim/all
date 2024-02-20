import { async } from "@core";

export const moduleName = "finance";

export const MainComponent = async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/:name(finance)?",
    title: "财务统计",
    order: 1,
    bar: true,
    component: MainComponent,
};

export interface State {
    name: string;
}
