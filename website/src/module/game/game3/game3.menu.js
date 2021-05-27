import { async } from "core";

export default {
    path: "/game/game3",
    title: "游戏3",
    icon: "",
    Component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
