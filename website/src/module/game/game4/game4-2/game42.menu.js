import { async } from "core";

export default {
    path: "/game/game4/game2",
    title: "游戏42",
    icon: "",
    Component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
