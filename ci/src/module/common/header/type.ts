import { ModuleStatement } from "utils/function/loadComponent";
import { async } from "@core";

export interface State {
    userName: string | null;
    prevPathname: string | null;
}

export const HeaderComponent = async(() => import(/* webpackChunkName: "header" */ "./index"), "MainComponent");
