import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {
    name: string | null;
    count: number;
}

export const statement: ModuleStatement = {
    path: "/",
    title: "Home",
    order: 1,
    component: async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent"),
};
