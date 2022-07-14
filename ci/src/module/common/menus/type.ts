import { async } from "@core";

export interface State {
    menus: any[];
}

export const MenuComponent = async(() => import(/* webpackChunkName: "menus" */ "./index"), "MainComponent");
