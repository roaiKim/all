import { async } from "@core";

export const COLLAPSED = "COLLAPSED";

export interface State {
    menus: any[];
    collapsed: boolean;
}

export const MenuComponent = async(() => import(/* webpackChunkName: "menus" */ "./index"), "MainComponent");
