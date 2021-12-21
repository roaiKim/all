import { async } from "@core";

export interface State {
    name: string | null;
}

export default {
    path: "/",
    title: "Table",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "gameTwo" */ "./index"), "MainComponent"),
    permissions: [],
};
