import {async} from "core";

export default {
    path: "/game2",
    title: "游戏2",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: []
}