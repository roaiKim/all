import { async } from "@core";

export interface HeaderTab {
    key: string;
    label: string;
    type: string;
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
