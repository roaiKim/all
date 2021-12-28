import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {
    name: string | null;
}

export const statement: ModuleStatement = {
    path: "/game-two",
    title: "game-two",
    component: async(() => import(/* webpackChunkName: "gameTwo" */ "./index"), "MainComponent"),
};
