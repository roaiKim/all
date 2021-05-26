import { async } from "core";

export default {
    path: "/user",
    title: "用户管理",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "user" */ "./index"), "MainComponent"),
    permissions: [],
};
