import { async } from "core";

export default {
    path: "/game/game4/game1",
    title: "游戏41",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
