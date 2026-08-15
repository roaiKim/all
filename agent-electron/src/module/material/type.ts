import { async } from "@core";

export const moduleName = "material";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "material" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/material",
    title: "Material",
    order: 1,
    component: MainComponent,
};
