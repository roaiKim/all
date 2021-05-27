import { async } from "core";

export default {
    path: "/game/game2",
    title: "游戏2",
    icon: "",
    Component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
