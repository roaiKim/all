import { async } from "@core";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {
    type: string | null;
    orders: Record<string, any>[];
}

export const ORDER_STATUS = {
    1: "待确认",
    2: "已确认",
    3: "已关闭",
};

export const statement: ModuleStatement = {
    path: "/:type(scan)?",
    title: "Home",
    order: 1,
    component: async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent"),
};
