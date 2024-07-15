import { async } from "@core";

export const moduleName = "{3}";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "{3}" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/{1}",
    title: "{2}",
    order: 1,
    component: MainComponent,
};
