import { async } from "core";

export default {
    path: "/table",
    title: "Table",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "table" */ "./index"), "MainComponent"),
    permissions: [],
};
