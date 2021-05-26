import { async } from "core";

export default {
    path: "/game/game1",
    title: "游戏1",
    icon: "",
    Component: async(() => import("./index"), "MainComponent"),
    permissions: [],
};
