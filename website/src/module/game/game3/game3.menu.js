import { async } from "core";

export default {
    path: "/game/game3",
    title: "游戏3",
    icon: "",
    component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
