import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {
    name: string | null;
}

export const statement: ModuleStatement = {
    path: "/game-one",
    title: "game-one",
    order: 2,
    component: async(() => import(/* webpackChunkName: "gameOne" */ "./index"), "MainComponent"),
};
