import { async } from "core";

export default {
    path: "/navigation",
    title: "菜单管理",
    icon: "",
    disabled: true,
    Component: async(() => import(/* webpackChunkName: "user1" */ "./index"), "MainComponent"),
    permissions: [],
};
