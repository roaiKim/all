import {async} from "core";

export default {
    path: "/game1",
    title: "游戏1",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: []
}