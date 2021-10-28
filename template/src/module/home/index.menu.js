import { async } from "core";

export default {
    path: "/",
    title: "主页",
    Component: async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent"),
    permissions: [],
};
