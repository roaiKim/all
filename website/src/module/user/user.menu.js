import { async } from "core";

export default {
    path: "/user",
    title: "用户管理",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
