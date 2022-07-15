import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "{3}" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    path: "/{1}",
    title: "{2}",
    order: 1,
    component: MainComponent,
};
