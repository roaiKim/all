import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {
    name: string | null;
    count: number;
}

export const statement: ModuleStatement = {
    path: "/example",
    title: "Example",
    order: 99,
    component: async(() => import(/* webpackChunkName: "example" */ "./component/index"), "default"),
};
