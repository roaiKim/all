import { async } from "@core";

export enum HeaderTabType {
    A = "A", // 项目存在的模块
    B = "B", // 项目存在 但没权限模块
    C = "C", // 项目开发中的模块
    D = "D", // 项目不存在的模块
}

export interface HeaderTab {
    key: string;
    label: string;
    type: HeaderTabType;
    noClosed?: boolean;
    children?: HeaderTab[];
}

export interface State {
    userName: string | null;
    prevPathname: string | null;
    headerTabs: HeaderTab[];
    activeTabName: string;
}

export const HeaderComponent = async(() => import(/* webpackChunkName: "header" */ "./index"), "MainComponent");
