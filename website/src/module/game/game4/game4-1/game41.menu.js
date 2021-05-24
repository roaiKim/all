import {async} from "core";

export default {
    path: "/game41",
    title: "游戏41",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: []
}