import {async} from "core";

export default {
    path: "/game42",
    title: "游戏42",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: []
}