import { async } from "core";

export default {
    path: "/usesr1",
    title: "用户管理1",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "user1" */ "./index"), "MainComponent"),
    permissions: [],
};
