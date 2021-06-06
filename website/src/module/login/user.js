import { async } from "core";

export default {
    path: "/login",
    title: "用户管理",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "login" */ "./index"), "MainComponent"),
    permissions: [],
};
